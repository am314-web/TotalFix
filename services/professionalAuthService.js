import { supabase } from "./supabase";

const ROLE_PROFESSIONAL = "professional";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

function decodeBase64ToArrayBuffer(base64) {
  let bufferLength = base64.length * 0.75;
  let len = base64.length;
  let i;
  let p = 0;
  let encoded1;
  let encoded2;
  let encoded3;
  let encoded4;

  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arrayBuffer);

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arrayBuffer;
}

export async function signUpProfessional({ fullName, email, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const trimmedName = (fullName || "").trim();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });
  if (error) throw error;

  const user = data?.user;
  if (!user?.id) {
    throw new Error("Professional signup did not return a user.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    [
      {
        id: user.id,
        name: trimmedName || normalizedEmail,
        role: ROLE_PROFESSIONAL,
        service_type: null,
        onboarding_complete: false,
      },
    ],
    { onConflict: "id" }
  );
  if (profileError) throw profileError;

  try {
    await createProfessionalRegistrationLog({
      userId: user.id,
      action: "professional_signup",
      message: "Professional account created via Supabase Auth",
      payload: {
        email: normalizedEmail,
        name: trimmedName || normalizedEmail,
      },
    });
  } catch (logError) {
    console.warn("Failed to write signup log:", logError?.message || logError);
  }

  return user;
}

export async function signInProfessional({ email, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
  if (error) throw error;

  const user = data?.user;
  if (!user?.id) {
    throw new Error("Professional login did not return a user.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;
  if (profile?.role !== ROLE_PROFESSIONAL) {
    throw new Error("This account is not registered as a professional.");
  }

  try {
    await createProfessionalRegistrationLog({
      userId: user.id,
      action: "professional_login",
      message: "Professional logged in",
      payload: {
        email: normalizedEmail,
        onboardingComplete: Boolean(profile?.onboarding_complete),
      },
    });
  } catch (logError) {
    console.warn("Failed to write login log:", logError?.message || logError);
  }

  return {
    user,
    onboardingComplete: Boolean(profile?.onboarding_complete),
  };
}

export async function completeProfessionalOnboarding({
  userId,
  fullName,
  phone,
  email,
  experienceYears,
  primaryService,
  aadhaarUploaded,
  certificateUploaded,
  aadhaarUrl,
  certificateUrl,
}) {
  const { error: professionalError } = await supabase
    .from("professional_profiles")
    .upsert(
      [
        {
          user_id: userId,
          full_name: fullName,
          phone: phone || null,
          email: (email || "").trim().toLowerCase(),
          experience_years: Number(experienceYears) || 0,
          primary_service: primaryService,
          aadhaar_uploaded: Boolean(aadhaarUploaded),
          certificate_uploaded: Boolean(certificateUploaded),
          aadhaar_url: aadhaarUrl || null,
          certificate_url: certificateUrl || null,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id" }
    );

  if (professionalError) throw professionalError;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: ROLE_PROFESSIONAL,
      service_type: (primaryService || "").toLowerCase().trim(),
      onboarding_complete: true,
      name: fullName,
    })
    .eq("id", userId);

  if (profileError) throw profileError;
}

export async function uploadProfessionalDocument(fileUri, userId, docType) {
  if (!fileUri || typeof fileUri !== "string") {
    throw new Error("Document URI must be a valid string.");
  }
  if (!userId) {
    throw new Error("User id is required to upload document.");
  }

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new Error(`Failed to load file for upload: ${e?.message || "unknown error"}`));
    };
    xhr.responseType = "blob";
    xhr.open("GET", fileUri, true);
    xhr.send(null);
  });

  const base64Str = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const parts = reader.result.split(",");
      resolve(parts[1] || parts[0]);
    };
    reader.onerror = () => reject(new Error("Failed reading document blob."));
    reader.readAsDataURL(blob);
  });

  const arrayBuffer = decodeBase64ToArrayBuffer(base64Str);
  const fileExt = fileUri.split(".").pop() || "jpg";
  const safeDocType = docType === "certificate" ? "certificate" : "aadhaar";
  const path = `${userId}/${safeDocType}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("professional-documents")
    .upload(path, arrayBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: fileExt === "png" ? "image/png" : "image/jpeg",
    });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("professional-documents")
    .getPublicUrl(path);

  return publicUrlData?.publicUrl || null;
}

export async function createProfessionalRegistrationLog({
  userId,
  action = "onboarding_completed",
  message = "Professional onboarding completed",
  payload = {},
}) {
  const { data, error } = await supabase
    .from("professional_registration_logs")
    .insert([
      {
        user_id: userId,
        action,
        message,
        payload,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data || null;
}

export async function fetchProfessionalRegistrationSnapshot(userId) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, role, service_type, onboarding_complete, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) throw profileError;

  const { data: professionalProfile, error: professionalProfileError } = await supabase
    .from("professional_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (professionalProfileError) throw professionalProfileError;

  return { profile, professionalProfile };
}

export async function fetchProfessionalRegistrationLogs(userId) {
  const { data, error } = await supabase
    .from("professional_registration_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
