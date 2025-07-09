
import { useState } from "react";
import { Calendar, Camera, MessageCircle, Phone, Users, Building, Star, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import ChatBot from "@/components/ChatBot";
import EmergencyContact from "@/components/EmergencyContact";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "gallery":
        return <ImageGallery />;
      case "chat":
        return <ChatBot />;
      case "contact":
        return <EmergencyContact />;
      default:
        return <HomeContent setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

const HomeContent = ({ setActiveSection }: { setActiveSection: (section: string) => void }) => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-emerald-100 text-emerald-700">
                Premium Residential Community
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Godrej <span className="text-emerald-600">Emerald</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your digital gateway to community living. Connect, share memories, and stay informed with fellow residents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setActiveSection("gallery")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Camera className="mr-2 h-5 w-5" />
                View Gallery
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setActiveSection("chat")}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with GEMA
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay connected and engaged with your residential community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-scale cursor-pointer group" onClick={() => setActiveSection("gallery")}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Camera className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Event Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Browse and relive memories from all community events, organized by year and event type for easy navigation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale cursor-pointer group" onClick={() => setActiveSection("chat")}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">GEMA Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get instant help and information about society rules, amenities, and services through our AI assistant.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale cursor-pointer group" onClick={() => setActiveSection("contact")}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <Phone className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Quick access to important contact information including society management and emergency services.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-in">
              <Building className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-emerald-100">Happy Families</div>
            </div>
            <div className="animate-slide-in">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Community Members</div>
            </div>
            <div className="animate-slide-in">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Events Celebrated</div>
            </div>
            <div className="animate-slide-in">
              <Star className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">5★</div>
              <div className="text-emerald-100">Community Rating</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
