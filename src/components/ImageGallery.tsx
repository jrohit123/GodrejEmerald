
import { useState, useEffect } from "react";
import { Calendar, Camera, ArrowLeft, Grid3X3, List, Play, Heart, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import ImageLightbox from "@/components/ImageLightbox";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  event_name: string;
  event_year: number;
  event_type: string;
  description: string;
  created_at: string;
}

interface EventMedia {
  id: string;
  event_id: string;
  image_name: string;
  image_url: string;
  storage_path: string;
  media_type: 'image' | 'video';
  caption?: string;
  likes_count: number;
  is_public: boolean;
  created_at: string;
}

const ImageGallery = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventMedia, setEventMedia] = useState<EventMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [likedMedia, setLikedMedia] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
    fetchEventMedia();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserLikes();
    }
  }, [currentUserId, eventMedia]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchUserLikes = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("media_likes")
      .select("media_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Failed to load user likes:", error);
      return;
    }

    setLikedMedia(new Set(data.map(like => like.media_id)));
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_year", { ascending: false });

    if (error) {
      console.error("Failed to load events:", error);
      return;
    }

    setEvents(data || []);
  };

  const fetchEventMedia = async () => {
    const { data, error } = await supabase
      .from("event_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load event media:", error);
      return;
    }

    setEventMedia((data || []) as EventMedia[]);
    setLoading(false);
  };

  const handleLike = async (mediaId: string) => {
    if (!currentUserId) {
      toast.error("Please log in to like images");
      return;
    }

    const media = eventMedia.find(m => m.id === mediaId);
    if (!media) return;

    const isLiked = likedMedia.has(mediaId);

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from("media_likes")
        .delete()
        .eq("media_id", mediaId)
        .eq("user_id", currentUserId);

      if (error) {
        toast.error("Failed to unlike");
        return;
      }

      // Update likes count
      await supabase
        .from("event_images")
        .update({ likes_count: Math.max(0, media.likes_count - 1) })
        .eq("id", mediaId);

      setLikedMedia(prev => {
        const newSet = new Set(prev);
        newSet.delete(mediaId);
        return newSet;
      });
      setEventMedia(prev => prev.map(m => 
        m.id === mediaId ? { ...m, likes_count: Math.max(0, m.likes_count - 1) } : m
      ));
    } else {
      // Like
      const { error } = await supabase
        .from("media_likes")
        .insert({ media_id: mediaId, user_id: currentUserId });

      if (error) {
        toast.error("Failed to like");
        return;
      }

      // Update likes count
      await supabase
        .from("event_images")
        .update({ likes_count: media.likes_count + 1 })
        .eq("id", mediaId);

      setLikedMedia(prev => new Set(prev).add(mediaId));
      setEventMedia(prev => prev.map(m => 
        m.id === mediaId ? { ...m, likes_count: m.likes_count + 1 } : m
      ));
    }
  };


  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = event.event_year.toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const years = Object.keys(eventsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Individual event gallery view
  if (selectedEvent && !loading) {
    const eventMediaItems = eventMedia.filter(media => media.event_id === selectedEvent.id);
    const images = eventMediaItems.filter(media => media.media_type === 'image');
    const videos = eventMediaItems.filter(media => media.media_type === 'video');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedEvent(null);
                  if (selectedEventType) {
                    // Stay in event type view
                  } else if (selectedYear) {
                    // Stay in year view  
                  }
                }}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedEvent.event_name}</h1>
                <p className="text-gray-600">
                  {selectedEvent.event_type} • {selectedEvent.event_year} • {images.length} photos, {videos.length} videos
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {eventMediaItems.map((media) => (
              <div key={media.id} className="group">
                {media.media_type === 'image' ? (
                  <div className="relative">
                    <img
                      src={media.image_url}
                      alt={media.image_name}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        const imageIndex = images.findIndex(img => img.id === media.id);
                        setLightboxIndex(imageIndex);
                        setLightboxOpen(true);
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                      {media.caption && (
                        <p className="text-white text-sm mb-2">{media.caption}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(media.id);
                          }}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${likedMedia.has(media.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          {media.likes_count}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Play className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-600">{media.image_name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {lightboxOpen && images.length > 0 && (
            <ImageLightbox
              images={images}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxOpen(false)}
              onNext={() => setLightboxIndex((prev) => Math.min(prev + 1, images.length - 1))}
              onPrevious={() => setLightboxIndex((prev) => Math.max(prev - 1, 0))}
              onLike={handleLike}
              likedMedia={likedMedia}
            />
          )}

          {eventMediaItems.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No media files found for this event.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Event type drill-down view
  if (selectedEventType && !loading) {
    const typeEvents = events.filter(event => event.event_type === selectedEventType);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEventType(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Event Types</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedEventType} Events</h1>
                <p className="text-gray-600">
                  {typeEvents.length} events captured
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeEvents.map((event) => {
              const eventMediaItems = eventMedia.filter(media => media.event_id === event.id);
              const images = eventMediaItems.filter(media => media.media_type === 'image');
              const videos = eventMediaItems.filter(media => media.media_type === 'video');
              const firstImage = images[0];
              
              return (
                <Card 
                  key={event.id} 
                  className="hover-scale cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    {firstImage ? (
                      <img
                        src={firstImage.image_url}
                        alt={event.event_name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 space-y-1">
                      {images.length > 0 && (
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {images.length} photos
                        </Badge>
                      )}
                      {videos.length > 0 && (
                        <Badge variant="secondary" className="bg-white/90 text-gray-700 flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {videos.length} videos
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.event_year}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (selectedYear && !loading) {
    const yearEvents = eventsByYear[selectedYear] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedYear(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Years</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedYear} Events</h1>
                <p className="text-gray-600">
                  {yearEvents.length} events captured
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {yearEvents.map((event) => {
              const eventMediaItems = eventMedia.filter(media => media.event_id === event.id);
              const images = eventMediaItems.filter(media => media.media_type === 'image');
              const videos = eventMediaItems.filter(media => media.media_type === 'video');
              const firstImage = images[0];
              
              return (
                <Card 
                  key={event.id} 
                  className="hover-scale cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    {firstImage ? (
                      <img
                        src={firstImage.image_url}
                        alt={event.event_name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 space-y-1">
                      {images.length > 0 && (
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {images.length} photos
                        </Badge>
                      )}
                      {videos.length > 0 && (
                        <Badge variant="secondary" className="bg-white/90 text-gray-700 flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {videos.length} videos
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.event_type} • {event.event_year}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through memories from all our community events, organized by year for easy navigation
          </p>
        </div>

        {!currentUserId && (
          <Alert className="mb-8 max-w-3xl mx-auto bg-blue-50 border-blue-200">
            <LogIn className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-900">
                You're viewing public images only. Log in to see all event photos and videos!
              </span>
              <Button asChild variant="default" size="sm" className="ml-4">
                <Link to="/login">Log In</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="year-view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="year-view">By Year</TabsTrigger>
            <TabsTrigger value="event-view">By Event Type</TabsTrigger>
          </TabsList>

          <TabsContent value="year-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {years.map((year) => {
                const yearEvents = eventsByYear[year];
                const yearMedia = eventMedia.filter(media => 
                  yearEvents.some(event => event.id === media.event_id)
                );
                const images = yearMedia.filter(media => media.media_type === 'image');
                const videos = yearMedia.filter(media => media.media_type === 'video');
                const firstImage = images[0];
                
                return (
                  <Card
                    key={year}
                    className="hover-scale cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedYear(year)}
                  >
                    <div className="relative">
                      {firstImage ? (
                        <img
                          src={firstImage.image_url}
                          alt={`${year} events`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold">{year}</h3>
                        <p className="text-sm opacity-90">{yearEvents.length} events</p>
                      </div>
                      <div className="absolute top-4 right-4 space-y-1">
                        {images.length > 0 && (
                          <Badge variant="secondary" className="bg-white/90 text-gray-700">
                            {images.length} photos
                          </Badge>
                        )}
                        {videos.length > 0 && (
                          <Badge variant="secondary" className="bg-white/90 text-gray-700 flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {videos.length} videos
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        {yearEvents.slice(0, 3).map((event) => {
                          const eventMediaItems = eventMedia.filter(media => media.event_id === event.id);
                          return (
                            <div key={event.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{event.event_name}</span>
                              <span className="text-gray-400">{eventMediaItems.length} files</span>
                            </div>
                          );
                        })}
                        {yearEvents.length > 3 && (
                          <div className="text-sm text-gray-400 text-center pt-2">
                            +{yearEvents.length - 3} more events
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="event-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(events.map(event => event.event_type))).map((eventType) => {
                const typeEvents = events.filter(event => event.event_type === eventType);
                const typeMedia = eventMedia.filter(media => 
                  typeEvents.some(event => event.id === media.event_id)
                );
                const images = typeMedia.filter(media => media.media_type === 'image');
                const videos = typeMedia.filter(media => media.media_type === 'video');
                
                return (
                  <Card 
                    key={eventType} 
                    className="hover-scale cursor-pointer group"
                    onClick={() => setSelectedEventType(eventType)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-6 w-6 text-emerald-600" />
                      </div>
                      <CardTitle className="text-lg">{eventType}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-emerald-600">{typeEvents.length}</div>
                        <div className="text-sm text-gray-500">celebrations</div>
                        <div className="text-sm text-gray-400">
                          {images.length} photos, {videos.length} videos
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImageGallery;
