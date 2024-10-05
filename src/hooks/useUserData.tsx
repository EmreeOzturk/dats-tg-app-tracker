import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";

const useUserData = () => {
    const parseUser = (data: Partial<User>): User => {
        return {
            _id: data._id ?? '',
            ipAddress: data.ipAddress ?? '',
            username: data.username ?? '',
            location: data.location ?? '',
            downloadSpeed: Number(data.downloadSpeed) || 0,
            uploadSpeed: Number(data.uploadSpeed) || 0,
            points: Number(data.points) || 0,
            totalTimeOfUsingApp: Number(data.totalTimeOfUsingApp) || 0,
            isFollowingTwitter: Boolean(data.isFollowingTwitter),
            hasJoinedDiscord: Boolean(data.hasJoinedDiscord),
            hasJoinedTelegram: Boolean(data.hasJoinedTelegram),
            profilePhoto: data.profilePhoto ?? '',
            evmAddress: data.evmAddress ?? '',
            substrateAddress: data.substrateAddress ?? '',
            lastCheckIn: data.lastCheckIn ?? '',
        };
    };

    const fetchUsers = async (): Promise<User[]> => {
        const response = await fetch("/api/users");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.users.map(parseUser);
    };

    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 60000,
        gcTime: 3600000,
        refetchOnWindowFocus: false,
    });

    return {
        users,
        isLoading,
        error,
    };
};

export default useUserData;