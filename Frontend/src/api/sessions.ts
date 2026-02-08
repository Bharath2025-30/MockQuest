import axiosInstance from '../lib/axios'

export const sessionApi = {
    CreateSession: async(data: any) => {
        const response = await axiosInstance.post("/RoomSession", data);
        return response.data;
    },

    getActiveSessions: async(data: any) => {
        console.log(data);
        const response = await axiosInstance.get("/RoomSession/active-sessions");
        return response.data;
    },

    getMyRecentSessions: async(userId: string) => {
            const response = await axiosInstance.get(`/RoomSession/previous-sessions/${userId}`);
            return response.data;
    },

    getSessionById: async(id: string) => {
        const response = await axiosInstance.get(`/RoomSession/${id}`);
        return response.data;
    },

    joinSession: async (id: string) => {
        const data = {
            userId : sessionStorage.getItem("userId"),
            clerkId: sessionStorage.getItem("clerkId")
        }
        const response = await axiosInstance.post(`/RoomSession/${id}/join`, data);
        return response.data;
    },

    endSession: async (id: string) => {
        const data = {
            userId : sessionStorage.getItem("userId"),
            clerkId: sessionStorage.getItem("clerkId")
        }
        const response = await axiosInstance.post(`/RoomSession/${id}/end`, data);
        return response.data;
    },

    getStreamToken: async (clerkId: string) => {
        const response = await axiosInstance.get(`/RoomSession/getStreamToken/${clerkId}`);
        return response.data;
    },

    getUserDetails: async (clerkId: string) => {
        const response = await axiosInstance.get(`/webhooks/getUserDetails/${clerkId}`);
        return response.data;
    },

}