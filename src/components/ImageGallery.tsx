
import { useState } from "react";
import { Calendar, Camera, ArrowLeft, Grid3X3, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data structure for events
const eventData = {
  "2024": [
    { name: "Diwali Celebration", date: "Nov 2024", images: 12, thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Holi Festival", date: "Mar 2024", images: 8, thumbnail: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "New Year Party", date: "Jan 2024", images: 15, thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Independence Day", date: "Aug 2024", images: 6, thumbnail: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ],
  "2023": [
    { name: "Diwali Celebration", date: "Nov 2023", images: 10, thumbnail: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Ganesh Chaturthi", date: "Sep 2023", images: 14, thumbnail: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Christmas Celebration", date: "Dec 2023", images: 9, thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ],
  "2022": [
    { name: "Diwali Celebration", date: "Nov 2022", images: 8, thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Annual Sports Day", date: "Oct 2022", images: 20, thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ],
};

const ImageGallery = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const years = Object.keys(eventData).sort((a, b) => parseInt(b) - parseInt(a));

  if (selectedYear) {
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
                  {eventData[selectedYear as keyof typeof eventData].length} events captured
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
            {eventData[selectedYear as keyof typeof eventData].map((event, index) => (
              <Card key={index} className="hover-scale cursor-pointer group overflow-hidden">
                <div className="relative">
                  <img
                    src={event.thumbnail}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {event.images} photos
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
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

        <Tabs defaultValue="year-view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="year-view">By Year</TabsTrigger>
            <TabsTrigger value="event-view">By Event Type</TabsTrigger>
          </TabsList>

          <TabsContent value="year-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {years.map((year) => {
                const events = eventData[year as keyof typeof eventData];
                const totalImages = events.reduce((sum, event) => sum + event.images, 0);
                
                return (
                  <Card
                    key={year}
                    className="hover-scale cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedYear(year)}
                  >
                    <div className="relative">
                      <img
                        src={events[0].thumbnail}
                        alt={`${year} events`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold">{year}</h3>
                        <p className="text-sm opacity-90">{events.length} events</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {totalImages} photos
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        {events.slice(0, 3).map((event, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{event.name}</span>
                            <span className="text-gray-400">{event.images} photos</span>
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-sm text-gray-400 text-center pt-2">
                            +{events.length - 3} more events
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
              {["Diwali Celebration", "Holi Festival", "Ganesh Chaturthi", "New Year Party", "Independence Day", "Christmas Celebration"].map((eventType) => {
                const eventCount = Object.values(eventData).flat().filter(event => event.name === eventType).length;
                const totalImages = Object.values(eventData).flat()
                  .filter(event => event.name === eventType)
                  .reduce((sum, event) => sum + event.images, 0);
                
                return (
                  <Card key={eventType} className="hover-scale cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-6 w-6 text-emerald-600" />
                      </div>
                      <CardTitle className="text-lg">{eventType}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-emerald-600">{eventCount}</div>
                        <div className="text-sm text-gray-500">celebrations</div>
                        <div className="text-sm text-gray-400">{totalImages} total photos</div>
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
