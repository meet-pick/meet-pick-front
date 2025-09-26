// src/hooks/useFriend.ts

import { useState, useCallback } from "react";
import {
  addFriendApi,
  getFriendsApi,
  acceptFriendApi,
  rejectFriendApi,
  cancelFriendApi,
  deleteFriendApi,
  FriendGetResponse,
  FriendAddRequest,
  FriendStatus,
} from "@/lib/api/friend-api";

// 프론트엔드에서 사용할 Friend 타입
export interface Friend {
  id: number; // Friend 테이블의 ID
  username: string;
  nickname: string;
  status: FriendStatus;
  isSender: boolean; // true: 사용자가 요청 발송자, false: 사용자가 요청 수신자
}

// 친구 요청을 종류별로 분류한 타입
export interface FriendRequests {
  received: Friend[]; // 받은 요청: isSender: false, status: PENDING
  sent: Friend[]; // 보낸 요청: isSender: true, status: PENDING
  accepted: Friend[]; // 친구 목록: status: ACCEPTED
  rejected: Friend[]; // 거절된 요청: status: REJECTED
  cancelled: Friend[]; // 취소된 요청: status: CANCEL
}

// 친구 통계 정보 타입
export interface FriendStats {
  totalFriends: number; // 실제 친구 수 (ACCEPTED)
  pendingReceived: number; // 받은 대기중인 요청
  pendingSent: number; // 보낸 대기중인 요청
  totalPending: number; // 전체 대기중인 요청
  rejected: number; // 거절된 요청
  cancelled: number; // 취소된 요청
}

export const useFriend = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // API 응답을 Friend 타입으로 변환
  const convertToFriend = useCallback(
    (apiResponse: FriendGetResponse): Friend => {
      return {
        id: apiResponse.id,
        username: apiResponse.username,
        nickname: apiResponse.nickname,
        status: apiResponse.status,
        isSender: apiResponse.sender,
      };
    },
    []
  );

  // 친구 목록 조회
  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFriendsApi();
      const convertedFriends = response.map(convertToFriend);
      setFriends(convertedFriends);

      console.log("Fetched friends:", convertedFriends);
    } catch (err: any) {
      setError(err.message || "친구 목록을 불러오는데 실패했습니다.");
      console.error("Failed to fetch friends:", err);
    } finally {
      setIsLoading(false);
    }
  }, [convertToFriend]);

  // 친구 추가 (Account ID로 친구 요청)
  const addFriend = useCallback(
    async (accountId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const request: FriendAddRequest = { friendId: accountId };
        await addFriendApi(request);

        // 성공 시 친구 목록 새로고침
        await fetchFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "친구 추가에 실패했습니다.");
        console.error("Failed to add friend:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFriends]
  );

  // 친구 요청 수락
  const acceptFriend = useCallback(
    async (friendId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await acceptFriendApi(friendId);

        // 성공 시 친구 목록 새로고침
        await fetchFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "친구 요청 수락에 실패했습니다.");
        console.error("Failed to accept friend:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFriends]
  );

  // 친구 요청 거절
  const rejectFriend = useCallback(
    async (friendId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await rejectFriendApi(friendId);

        // 성공 시 친구 목록 새로고침
        await fetchFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "친구 요청 거절에 실패했습니다.");
        console.error("Failed to reject friend:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFriends]
  );

  // 친구 요청 취소
  const cancelFriend = useCallback(
    async (friendId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await cancelFriendApi(friendId);

        // 성공 시 친구 목록 새로고침
        await fetchFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "친구 요청 취소에 실패했습니다.");
        console.error("Failed to cancel friend:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFriends]
  );

  // 친구 삭제
  const deleteFriend = useCallback(
    async (friendId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteFriendApi(friendId);

        // 성공 시 친구 목록 새로고침
        await fetchFriends();
        return true;
      } catch (err: any) {
        setError(err.message || "친구 삭제에 실패했습니다.");
        console.error("Failed to delete friend:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFriends]
  );

  // 친구 요청을 종류별로 분류하는 함수
  const getFriendRequests = useCallback((): FriendRequests => {
    const received = friends.filter(
      (friend) => !friend.isSender && friend.status === "PENDING"
    );
    const sent = friends.filter(
      (friend) => friend.isSender && friend.status === "PENDING"
    );
    const accepted = friends.filter((friend) => friend.status === "ACCEPTED");
    const rejected = friends.filter((friend) => friend.status === "REJECTED");
    const cancelled = friends.filter((friend) => friend.status === "CANCEL");

    return { received, sent, accepted, rejected, cancelled };
  }, [friends]);

  // 친구 통계 정보
  const getFriendStats = useCallback((): FriendStats => {
    const requests = getFriendRequests();
    return {
      totalFriends: requests.accepted.length,
      pendingReceived: requests.received.length,
      pendingSent: requests.sent.length,
      totalPending: requests.received.length + requests.sent.length,
      rejected: requests.rejected.length,
      cancelled: requests.cancelled.length,
    };
  }, [getFriendRequests]);

  // 특정 사용자와의 친구 상태 확인 (Account ID 기준)
  const getFriendStatusByAccount = useCallback(
    (accountId: number): FriendStatus | null => {
      // 이 함수를 사용하려면 API에서 Account ID 정보도 함께 제공해야 함
      // 현재 백엔드 DTO에서는 Account ID를 제공하지 않으므로 추후 구현 필요
      return null;
    },
    []
  );

  // 친구 ID로 친구 정보 찾기
  const getFriendById = useCallback(
    (friendId: number): Friend | null => {
      return friends.find((friend) => friend.id === friendId) || null;
    },
    [friends]
  );

  return {
    friends,
    isLoading,
    error,
    clearError,
    fetchFriends,
    addFriend,
    acceptFriend,
    rejectFriend,
    cancelFriend,
    deleteFriend,
    getFriendRequests,
    getFriendStats,
    getFriendStatusByAccount,
    getFriendById,
  };
};
