import { useQuery } from "@tanstack/react-query";
const useUserData = () => {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }
    });
    return { users, isLoading, error };
};

export default useUserData;