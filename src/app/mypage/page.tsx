"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Edit,
  Save,
  X,
  MapPin,
  Calendar,
  Mail,
  UserPlus,
  UserMinus,
  Search,
  Users,
  Settings,
  Shield,
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useFriend } from "@/hooks/useFriend";

export default function MyPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    friends,
    isLoading: friendLoading,
    error: friendError,
    clearError,
    fetchFriends,
    addFriend,
    acceptFriend,
    rejectFriend,
    cancelFriend,
    deleteFriend,
    getFriendRequests,
    getFriendStats,
  } = useFriend();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 친구 추가용 검색 상태 (임시로 ID 직접 입력하는 방식)
  const [friendIdToAdd, setFriendIdToAdd] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  // 프로필 편집용 상태
  const [editProfile, setEditProfile] = useState({
    nickname: user?.nickname || "",
    location: user?.location || "",
    bio: "",
  });

  // 컴포넌트 마운트 시 친구 목록 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
    }
  }, [isAuthenticated, fetchFriends]);

  // 사용자 정보 업데이트 시 편집 폼 동기화
  useEffect(() => {
    if (user) {
      setEditProfile({
        nickname: user.nickname || "",
        location: user.location || "",
        bio: "",
      });
    }
  }, [user]);

  // 로그인 체크
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Shield className="h-12 w-12 text-warning" />
            <h2 className="text-xl font-semibold text-text-primary">
              로그인이 필요합니다
            </h2>
            <p className="text-text-primary opacity-60 text-center">
              마이페이지를 이용하려면 로그인해주세요.
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로딩 상태
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-primary opacity-60">
            사용자 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // TODO: API 호출로 프로필 업데이트
    console.log("프로필 저장:", editProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditProfile({
      nickname: user?.nickname || "",
      location: user?.location || "",
      bio: "",
    });
    setIsEditingProfile(false);
  };

  // 친구 추가 (임시로 Account ID 직접 입력)
  const handleAddFriend = async () => {
    const accountId = parseInt(friendIdToAdd);
    if (isNaN(accountId) || accountId <= 0) {
      alert("올바른 사용자 ID를 입력해주세요.");
      return;
    }

    setIsAddingFriend(true);
    const success = await addFriend(accountId);

    if (success) {
      setIsAddFriendDialogOpen(false);
      setFriendIdToAdd("");
      alert("친구 요청을 보냈습니다!");
    }
    setIsAddingFriend(false);
  };

  // 친구 삭제
  const handleRemoveFriend = async (friendId: number, nickname: string) => {
    if (confirm(`정말 ${nickname}님을 친구에서 삭제하시겠습니까?`)) {
      const success = await deleteFriend(friendId);
      if (success) {
        alert("친구가 삭제되었습니다.");
      }
    }
  };

  // 친구 요청 수락
  const handleAcceptFriendRequest = async (requestId: number) => {
    const success = await acceptFriend(requestId);
    if (success) {
      alert("친구 요청을 수락했습니다!");
    }
  };

  // 친구 요청 거절
  const handleRejectFriendRequest = async (requestId: number) => {
    const success = await rejectFriend(requestId);
    if (success) {
      alert("친구 요청을 거절했습니다.");
    }
  };

  // 친구 요청 취소
  const handleCancelSentRequest = async (requestId: number) => {
    if (confirm("친구 요청을 취소하시겠습니까?")) {
      const success = await cancelFriend(requestId);
      if (success) {
        alert("친구 요청이 취소되었습니다.");
      }
    }
  };

  // 실제 친구 데이터 가져오기
  const friendRequests = getFriendRequests();
  const friendStats = getFriendStats();

  // 검색으로 필터링된 친구 목록 (수락된 친구만)
  const filteredFriends = friendRequests.accepted.filter(
    (friend) =>
      friend.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="border-b border-background-secondary pb-6">
        <h1 className="text-2xl font-bold text-text-primary">마이페이지</h1>
        <p className="text-text-primary opacity-80 mt-1">
          내 정보를 관리하고 친구들과 연결하세요
        </p>
      </div>

      {/* 친구 API 에러 메시지 */}
      {friendError && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{friendError}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-danger hover:text-danger"
          >
            ×
          </Button>
        </div>
      )}

      {/* 탭 메뉴 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">내 정보</span>
            <span className="sm:hidden">정보</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">친구목록</span>
            <span className="sm:hidden">친구</span>
          </TabsTrigger>
        </TabsList>

        {/* 내 정보 탭 */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 프로필 카드 */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>프로필 정보</span>
                </CardTitle>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    편집
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      취소
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingProfile ? (
                  // 읽기 모드
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary">
                          {user?.nickname}
                        </h3>
                        <p className="text-text-primary opacity-60">
                          @{user?.username}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-text-primary opacity-60" />
                        <span className="text-sm">@{user?.username}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-text-primary opacity-60" />
                        <span className="text-sm">
                          {user?.location || "위치 미설정"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-text-primary opacity-60">
                        자기소개
                      </Label>
                      <p className="text-sm mt-1 text-text-primary">
                        안녕하세요! MeetPick에서 새로운 사람들과 만나고
                        있습니다.
                      </p>
                    </div>
                  </div>
                ) : (
                  // 편집 모드
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nickname">닉네임</Label>
                      <Input
                        id="nickname"
                        value={editProfile.nickname}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            nickname: e.target.value,
                          })
                        }
                        placeholder="닉네임을 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">위치</Label>
                      <Input
                        id="location"
                        value={editProfile.location}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            location: e.target.value,
                          })
                        }
                        placeholder="위치를 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">자기소개</Label>
                      <Textarea
                        id="bio"
                        value={editProfile.bio}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            bio: e.target.value,
                          })
                        }
                        placeholder="자기소개를 작성해주세요"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 통계 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>활동 통계</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    친구 수
                  </span>
                  <span className="font-semibold text-primary">
                    {friendStats.totalFriends}명
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    받은 요청
                  </span>
                  <span className="font-semibold text-secondary">
                    {friendStats.pendingReceived}개
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    보낸 요청
                  </span>
                  <span className="font-semibold text-accent">
                    {friendStats.pendingSent}개
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    가입일
                  </span>
                  <span className="text-sm">2024.01.15</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 친구목록 탭 */}
        <TabsContent value="friends" className="mt-6">
          <div className="space-y-6">
            {/* 검색 및 친구 추가 */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                <Input
                  placeholder="친구 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setIsAddFriendDialogOpen(true)}
                disabled={friendLoading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                친구 추가
              </Button>
            </div>

            {/* 로딩 상태 */}
            {friendLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-text-primary opacity-60">
                  친구 목록을 불러오는 중...
                </p>
              </div>
            )}

            {/* 친구 요청 섹션 - 아코디언 */}
            {!friendLoading && (
              <Accordion type="single" collapsible className="w-full">
                {/* 받은 친구 요청 */}
                {friendRequests.received.length > 0 && (
                  <AccordionItem
                    value="received-requests"
                    className="border rounded-lg mb-4"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">받은 친구 요청</span>
                        <Badge variant="destructive" className="ml-2">
                          {friendRequests.received.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {friendRequests.received.map((request) => (
                          <Card key={request.id} className="border-primary/20">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-text-primary">
                                    {request.nickname}
                                  </h4>
                                  <p className="text-xs text-text-primary opacity-60">
                                    @{request.username}
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleAcceptFriendRequest(request.id)
                                  }
                                  disabled={friendLoading}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  수락
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-danger hover:text-danger"
                                  onClick={() =>
                                    handleRejectFriendRequest(request.id)
                                  }
                                  disabled={friendLoading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  거절
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* 보낸 친구 요청 */}
                {friendRequests.sent.length > 0 && (
                  <AccordionItem
                    value="sent-requests"
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span className="font-medium">보낸 친구 요청</span>
                        <Badge variant="secondary" className="ml-2">
                          {friendRequests.sent.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {friendRequests.sent.map((request) => (
                          <Card
                            key={request.id}
                            className="border-secondary/20"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-text-primary">
                                    {request.nickname}
                                  </h4>
                                  <p className="text-xs text-text-primary opacity-60">
                                    @{request.username}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  대기중
                                </Badge>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-danger hover:text-danger"
                                onClick={() =>
                                  handleCancelSentRequest(request.id)
                                }
                                disabled={friendLoading}
                              >
                                <X className="h-4 w-4 mr-1" />
                                요청 취소
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}

            {/* 친구 목록 */}
            {!friendLoading && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    내 친구 ({friendStats.totalFriends})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFriends.map((friend) => (
                    <Card key={friend.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-primary">
                              {friend.nickname}
                            </h4>
                            <p className="text-xs text-text-primary opacity-60">
                              @{friend.username}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRemoveFriend(friend.id, friend.nickname)
                            }
                            className="text-danger hover:text-danger"
                            disabled={friendLoading}
                          >
                            <UserMinus className="h-4 w-4 mr-1" />
                            친구 삭제
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredFriends.length === 0 && !friendLoading && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-text-primary opacity-30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary opacity-60 mb-2">
                      {searchQuery
                        ? "검색 결과가 없습니다"
                        : "아직 친구가 없습니다"}
                    </h3>
                    <p className="text-text-primary opacity-60">
                      {searchQuery
                        ? "다른 검색어로 시도해보세요"
                        : "새로운 친구를 추가해보세요"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 친구 추가 다이얼로그 */}
      <Dialog
        open={isAddFriendDialogOpen}
        onOpenChange={setIsAddFriendDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>친구 추가</DialogTitle>
            <DialogDescription>
              추가할 사용자의 ID를 입력해주세요 (임시 기능)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="friend-id">사용자 ID</Label>
              <Input
                id="friend-id"
                type="number"
                placeholder="예: 123"
                value={friendIdToAdd}
                onChange={(e) => setFriendIdToAdd(e.target.value)}
                disabled={isAddingFriend}
              />
              <p className="text-xs text-text-primary opacity-60">
                * 임시 기능입니다. 실제로는 사용자명으로 검색하는 기능이
                필요합니다.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={handleAddFriend}
                disabled={isAddingFriend || !friendIdToAdd.trim()}
              >
                {isAddingFriend ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    추가 중...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    친구 추가
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddFriendDialogOpen(false);
                  setFriendIdToAdd("");
                }}
                className="flex-1"
                disabled={isAddingFriend}
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
