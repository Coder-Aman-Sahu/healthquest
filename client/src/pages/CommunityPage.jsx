"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { communityAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Heart, MessageCircle, Share, Trophy, Users, Target } from "lucide-react"

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("feed")

  const { data: posts, isLoading: postsLoading } = useQuery("community-posts", communityAPI.getPosts)
  const { data: challenges, isLoading: challengesLoading } = useQuery("challenges", communityAPI.getChallenges)
  const { data: friends, isLoading: friendsLoading } = useQuery("friends", communityAPI.getFriends)

  const tabs = [
    { id: "feed", label: "Activity Feed", icon: Users },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "friends", label: "Friends", icon: Heart },
  ]

  if (postsLoading || challengesLoading || friendsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const postsList = posts?.data?.data || []
  const challengesList = challenges?.data?.data || []
  const friendsList = friends?.data?.data || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Community</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          {postsList.length > 0 ? (
            postsList.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">Be the first to share your fitness journey!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "challenges" && (
        <div className="space-y-6">
          {challengesList.length > 0 ? (
            challengesList.map((challenge) => <ChallengeCard key={challenge._id} challenge={challenge} />)
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges available</h3>
              <p className="text-gray-500">Check back later for new challenges!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-6">
          {friendsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendsList.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
              <p className="text-gray-500">Connect with others to share your fitness journey!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {post.user?.name?.charAt(0) || "U"}
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{post.user?.name || "Unknown User"}</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>
      </div>

      <p className="text-gray-900 mb-4">{post.content}</p>

      {post.type === "achievement" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Achievement Unlocked!</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5 mr-1" />
            <span className="text-sm">{post.likeCount || 0}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="h-5 w-5 mr-1" />
            <span className="text-sm">{post.commentCount || 0}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-green-500 transition-colors">
            <Share className="h-5 w-5 mr-1" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const ChallengeCard = ({ challenge }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
            <p className="text-sm text-gray-500">{challenge.duration}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
          {challenge.participants} joined
        </span>
      </div>

      <p className="text-gray-600 mb-4">{challenge.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Reward:</span> {challenge.reward}
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Join Challenge
        </button>
      </div>
    </div>
  )
}

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {friend.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">{friend.name}</p>
            <p className="text-sm text-gray-500">Last active: {friend.lastActivity}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${friend.status === "online" ? "bg-green-400" : "bg-gray-400"}`}></div>
          <span className="text-sm text-gray-500 ml-2 capitalize">{friend.status}</span>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
