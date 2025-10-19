import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Upload, Plus } from "lucide-react";

interface Event {
  id: string;
  event_name: string;
  event_year: number;
  event_type: string;
  description: string;
}

interface EventImage {
  id: string;
  event_id: string;
  image_name: string;
  image_url: string;
  storage_path: string;
}

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Event form state
  const [eventName, setEventName] = useState("");
  const [eventYear, setEventYear] = useState("");
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");

  // Media upload state
  const [selectedEvent, setSelectedEvent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaCaption, setMediaCaption] = useState("");

  useEffect(() => {
    checkUser();
    fetchEvents();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }
    setUser(user);
    setLoading(false);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_year", { ascending: false });

    if (error) {
      toast.error("Failed to load events");
      return;
    }

    setEvents(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("events")
      .insert({
        event_name: eventName,
        event_year: parseInt(eventYear),
        event_type: eventType,
        description,
      });

    if (error) {
      toast.error("Failed to create event");
      return;
    }

    toast.success("Event created successfully!");
    setEventName("");
    setEventYear("");
    setEventType("");
    setDescription("");
    fetchEvents();
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }

    setUploading(true);
    const files = Array.from(e.target.files);
    const bucketName = mediaType === "image" ? "event-images" : "event-videos";

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${selectedEvent}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from("event_images")
        .insert({
          event_id: selectedEvent,
          image_name: file.name,
          image_url: publicUrl,
          storage_path: filePath,
          media_type: mediaType,
          caption: mediaCaption || null,
          likes_count: 0,
        });

      if (dbError) {
        toast.error(`Failed to save ${file.name} to database`);
      }
    }

    setUploading(false);
    toast.success(`${mediaType === "image" ? "Images" : "Videos"} uploaded successfully!`);
    setMediaCaption("");
    e.target.value = "";
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="images">Upload Media</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>
                  Add a new event to organize images by year and type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Diwali Celebration"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventYear">Event Year</Label>
                      <Input
                        id="eventYear"
                        type="number"
                        value={eventYear}
                        onChange={(e) => setEventYear(e.target.value)}
                        placeholder="2024"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={eventType} onValueChange={setEventType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Wedding">Wedding</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Birthday">Birthday</SelectItem>
                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Event description..."
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.event_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.event_type} • {event.event_year}
                          </p>
                          {event.description && (
                            <p className="text-sm mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Media</CardTitle>
                <CardDescription>
                  Upload images and videos for existing events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eventSelect">Select Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.event_name} ({event.event_year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Media Type</Label>
                  <Select value={mediaType} onValueChange={(value: "image" | "video") => setMediaType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="caption">Caption (optional)</Label>
                  <Textarea
                    id="caption"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    placeholder="Add a caption for the media..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="media">Upload {mediaType === "image" ? "Images" : "Videos"}</Label>
                  <Input
                    id="media"
                    type="file"
                    multiple
                    accept={mediaType === "image" ? "image/*" : "video/*"}
                    onChange={handleMediaUpload}
                    disabled={uploading || !selectedEvent}
                  />
                </div>
                {uploading && (
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 animate-spin" />
                    <span>Uploading {mediaType === "image" ? "images" : "videos"}...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;