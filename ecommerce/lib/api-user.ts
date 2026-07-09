import { LoginRequest, UpdatePasswordRequest, User, UserRegistrationRequest } from "@/models/user.model";
import { fetchWithAuth } from "./api";
import { Address } from "@/models/address.model";
const API_BASE = "http://localhost:8082/api";

export async function register(request : UserRegistrationRequest) : Promise<User>{
    const res = await fetch(`${API_BASE}/auth/register`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",

        },
        body : JSON.stringify(request)
    })
    if (!res.ok) throw new Error("Erreur lors de la création utilisateur");
    return res.json();
}

export async function login(request: LoginRequest): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Email ou mot de passe incorrect");
  const token = res.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const user: User = await res.json();
  return { user, token };
}

export async function getProfile(authHeaders : Record<string,string>) : Promise<User> {
    const res = await fetchWithAuth(`${API_BASE}/profile`, authHeaders);
    if (!res.ok) throw new Error("Impossible de charger le profil");
    return res.json();
}

export async function updateProfile(user : User, authHeaders : Record<string, string>) : Promise<User>{
const res = await fetchWithAuth(`${API_BASE}/profile`, authHeaders, {
    method: "PUT",
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil");
  return res.json();
}


export async function changePassword(request: UpdatePasswordRequest, authHeaders: Record<string, string>) : Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/profile/password`, authHeaders, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du mot de passe");
}

export async function getAddresses(authHeaders : Record<string,string>) : Promise<Address[]>{
     const res = await fetchWithAuth(`${API_BASE}/profile/addresses`, authHeaders);
    if (!res.ok) throw new Error("Impossible de charger les adresses");
    return res.json();
}
