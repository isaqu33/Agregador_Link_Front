import axios from "axios";
import { usePageContext } from "../contexts/PageContext";
import { AnalyticsSummary, CreateLink, Lead, LinkOptions, User } from "../utils/types";

// The browser never holds the API token: requests go through the Next.js proxy
// (app/api/backend), which adds it from the Auth.js session cookie.
const api = axios.create({ baseURL: "/api/backend" });

function useApi() {
  // the panel edits one page at a time; calls below target it (main page when empty)
  const { pageId } = usePageContext();

  const editProfile = async (data: User) => {
    try {
      return pageId
        ? await api.post("/pages/edit", { id: pageId, ...data })
        : await api.post("/user/editProfile", data);
    } catch (error) {
      throw "error";
    }
  };

  const getMe = async () => {
    try {
      return await api.get("/user/me");
    } catch (error) {
      throw "error";
    }
  };

  const CreateNewLink = async (data: CreateLink) => {
    try {
      return await api.post("/links/addLink", pageId ? { ...data, pageId } : data);
    } catch (error) {
      throw "error";
    }
  };

  const DeleteLink = async (idlink: string) => {
    try {
      return await api.post("/links/deletLink", { idlink });
    } catch (error) {
      throw "error";
    }
  };

  const getDataById = async (idUser: string) => {
    try {
      const { data } = await api.get<User>(`/links/getDataUser/${idUser}`);
      return data;
    } catch (error) {
      throw "error";
    }
  };

  const editLink = async (data: { id: string; name?: string; link?: string } & LinkOptions) => {
    const response = await api.post("/links/editLink", data);
    return response.data;
  };

  const reorderLinks = async (ids: string[]) => {
    const response = await api.post("/links/reorder", { ids });
    return response.data;
  };

  const editAtivacao = async (id: string, activation: boolean) => {
    const { data } = await api.post("/links/editActivet", { id, activation });
    return data;
  };

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  // Returns the stored path (/media/<user>/<file>) that goes into photoURL.
  // Also used for page background videos (MP4/WebM, up to 15 MB; images up to 5 MB).
  const uploadImage = async (file: Blob): Promise<string> => {
    const form = new FormData();
    form.append("file", file, file instanceof File ? file.name : "image.png");
    const { data } = await api.post<{ url: string }>("/media", form);
    return data.url;
  };

  const forgotPassword = async (email: string) => (await api.post("/auth/forgot-password", { email })).data;
  const resetPassword = async (token: string, password: string) =>
    (await api.post("/auth/reset-password", { token, password })).data;
  const verifyEmail = async (token: string) => (await api.post("/auth/verify-email", { token })).data;
  const resendVerification = async () => (await api.post("/auth/resend-verification")).data;

  const getAnalytics = async (days: number) => {
    const { data } = await api.get<AnalyticsSummary>(
      `/analytics/summary?days=${days}${pageId ? `&pageId=${pageId}` : ""}`
    );
    return data;
  };

  // downloads: plain links the browser follows (the proxy adds the session token)
  const exportUrl = (path: string, extra = "") =>
    `/api/backend/${path}?${extra}${pageId ? `&pageId=${pageId}` : ""}`;

  // ---- extra pages ----
  const getPage = async (id: string) => api.get(`/pages/${id}`);
  const createPage = async (name: string) => (await api.post("/pages/create", { name })).data;
  const deletePage = async (id: string) => (await api.post("/pages/delete", { id })).data;

  // ---- e-mail contacts ----
  // One page of contacts; `cursor` is the nextCursor of the previous page (undefined = first page).
  const getLeads = async (cursor?: string) => {
    const params = new URLSearchParams({ limit: "50" });
    if (pageId) params.set("pageId", pageId);
    if (cursor) params.set("cursor", cursor);
    const { data } = await api.get<{ total: number; leads: Lead[]; nextCursor: string | null }>(
      `/leads?${params.toString()}`
    );
    return data;
  };
  const deleteLead = async (id: string) => (await api.post("/leads/delete", { id })).data;

  // ---- public page (visitors) ----
  const captureLead = async (data: { linkId: string; email: string; name?: string; website?: string }) =>
    (await api.post("/leads", data)).data;
  const unlockLink = async (linkId: string, password: string) =>
    (await api.post<{ link: string }>("/links/unlock", { linkId, password })).data;

  return {
    exportUrl,
    getPage,
    createPage,
    deletePage,
    getLeads,
    deleteLead,
    captureLead,
    unlockLink,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getAnalytics,
    editProfile,
    getMe,
    CreateNewLink,
    DeleteLink,
    getDataById,
    editLink,
    reorderLinks,
    editAtivacao,
    registerUser,
    uploadImage,
  };
}

export default useApi;
