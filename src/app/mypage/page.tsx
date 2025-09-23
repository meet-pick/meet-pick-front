"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 프로필 편집용 상태
  const [editProfile, setEditProfile] = useState({
    nickname: user?.nickname || "",
    location: user?.location || "",
    bio: "",
  });

  // 더미 친구 데이터 (실제로는 API에서 가져올 예정)
  const [friends] = useState([
    {
      id: 1,
      username: "friend1",
      nickname: "김친구",
      location: "서울시 강남구",
      status: "online",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      username: "friend2",
      nickname: "이친구",
      location: "서울시 서초구",
      status: "offline",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      username: "friend3",
      nickname: "박친구",
      location: "경기도 성남시",
      status: "online",
      joinDate: "2024-03-10",
    },
  ]);

  // 친구 요청 데이터
  const [receivedRequests] = useState([
    {
      id: 1,
      username: "newuser1",
      nickname: "최신규",
      location: "서울시 종로구",
      requestDate: "2025-01-20",
    },
    {
      id: 2,
      username: "newuser2",
      nickname: "한신규",
      location: "부산시 해운대구",
      requestDate: "2025-01-18",
    },
  ]);

  const [sentRequests] = useState([
    {
      id: 1,
      username: "pending1",
      nickname: "이대기",
      location: "대구시 수성구",
      requestDate: "2025-01-19",
    },
  ]);

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
  if (isLoading) {
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
    // 실제로는 사용자 정보 갱신 API 호출
  };

  const handleCancelEdit = () => {
    setEditProfile({
      nickname: user?.nickname || "",
      location: user?.location || "",
      bio: "",
    });
    setIsEditingProfile(false);
  };

  const handleRemoveFriend = (friendId: number) => {
    if (confirm("정말 친구를 삭제하시겠습니까?")) {
      // TODO: 친구 삭제 API 호출
      console.log("친구 삭제:", friendId);
    }
  };

  const handleAcceptFriendRequest = (requestId: number) => {
    // TODO: 친구 요청 수락 API 호출
    console.log("친구 요청 수락:", requestId);
  };

  const handleRejectFriendRequest = (requestId: number) => {
    // TODO: 친구 요청 거절 API 호출
    console.log("친구 요청 거절:", requestId);
  };

  const handleCancelSentRequest = (requestId: number) => {
    if (confirm("친구 요청을 취소하시겠습니까?")) {
      // TODO: 보낸 친구 요청 취소 API 호출
      console.log("친구 요청 취소:", requestId);
    }
  };

  const filteredFriends = friends.filter(
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
                    {friends.length}명
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    참여 모임
                  </span>
                  <span className="font-semibold text-secondary">12개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-primary opacity-60">
                    생성 모임
                  </span>
                  <span className="font-semibold text-accent">3개</span>
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
              <Button onClick={() => setIsAddFriendDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                친구 추가
              </Button>
            </div>

            {/* 친구 요청 섹션 - 모든 화면에서 아코디언 */}
            <Accordion type="single" collapsible className="w-full">
              {/* 받은 친구 요청 아코디언 */}
              {receivedRequests.length > 0 && (
                <AccordionItem
                  value="received-requests"
                  className="border rounded-lg mb-4"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span className="font-medium">받은 친구 요청</span>
                      <Badge variant="destructive" className="ml-2">
                        {receivedRequests.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {receivedRequests.map((request) => (
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

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-text-primary opacity-60" />
                                <span className="text-xs text-text-primary opacity-80">
                                  {request.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleAcceptFriendRequest(request.id)
                                }
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

              {/* 보낸 친구 요청 아코디언 */}
              {sentRequests.length > 0 && (
                <AccordionItem
                  value="sent-requests"
                  className="border rounded-lg"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="font-medium">보낸 친구 요청</span>
                      <Badge variant="secondary" className="ml-2">
                        {sentRequests.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sentRequests.map((request) => (
                        <Card key={request.id} className="border-secondary/20">
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

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-text-primary opacity-60" />
                                <span className="text-xs text-text-primary opacity-80">
                                  {request.location}
                                </span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-danger hover:text-danger"
                              onClick={() =>
                                handleCancelSentRequest(request.id)
                              }
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

            {/* 친구 목록 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-text-primary">
                  내 친구 ({friends.length})
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

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-text-primary opacity-60" />
                          <span className="text-xs text-text-primary opacity-80">
                            {friend.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="text-danger hover:text-danger"
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          친구 삭제
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFriends.length === 0 && (
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
              사용자명으로 친구를 검색하여 추가할 수 있습니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-friend">사용자명</Label>
              <Input
                id="search-friend"
                placeholder="@username"
                className="pl-8"
              />
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddFriendDialogOpen(false)}
                className="flex-1"
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
