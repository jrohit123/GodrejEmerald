
import { Phone, Mail, MapPin, Clock, Shield, AlertTriangle, User, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EmergencyContact = () => {
  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const emergencyContacts = [
    {
      title: "Society Manager",
      name: "Rajas Dhanmeher",
      phone: "9920319852",
      role: "Primary Contact",
      availability: "24/7 Emergency Support",
      icon: User,
      bgColor: "bg-red-500",
      isPrimary: true,
    },
    {
      title: "Security Office",
      name: "Security Desk",
      phone: "022-XXXX-XXXX",
      role: "Security & Access",
      availability: "24/7 Available",
      icon: Shield,
      bgColor: "bg-blue-500",
      isPrimary: false,
    },
    {
      title: "Maintenance Team",
      name: "Technical Support",
      phone: "022-XXXX-XXXX",
      role: "Repairs & Maintenance",
      availability: "Mon-Sat, 9 AM - 6 PM",
      icon: Building,
      bgColor: "bg-green-500",
      isPrimary: false,
    },
  ];

  const emergencyServices = [
    { name: "Police", number: "100", description: "Law enforcement emergency" },
    { name: "Fire Brigade", number: "101", description: "Fire emergency services" },
    { name: "Ambulance", number: "108", description: "Medical emergency services" },
    { name: "Disaster Helpline", number: "1070", description: "Natural disaster support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Contacts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Important contact information for society management and emergency services
          </p>
          <div className="flex justify-center mt-6">
            <Badge variant="destructive" className="px-4 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Keep these numbers handy
            </Badge>
          </div>
        </div>

        {/* Society Contacts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Society Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className={`hover-scale ${contact.isPrimary ? 'ring-2 ring-red-200 border-red-200' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 ${contact.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{contact.title}</CardTitle>
                    {contact.isPrimary && (
                      <Badge variant="destructive" className="mt-2">
                        Primary Emergency Contact
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleCall(contact.phone)}
                        className={`w-full ${contact.isPrimary ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
                        size="lg"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {contact.phone}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {contact.availability}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Emergency Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="hover-scale cursor-pointer" onClick={() => handleCall(service.number)}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                  <div className="text-2xl font-bold text-red-600 mb-2">{service.number}</div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Important Emergency Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">For Society Issues:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Contact Society Manager first</li>
                  <li>• Security office for immediate assistance</li>
                  <li>• Maintenance team for technical issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Life-Threatening Emergencies:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Call emergency services immediately</li>
                  <li>• Then inform society management</li>
                  <li>• Stay calm and provide clear information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Contact Info */}
        <div className="mt-8 text-center">
          <Card className="inline-block bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 text-emerald-700 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Godrej Emerald Society</span>
              </div>
              <p className="text-sm text-emerald-600">
                For non-emergency queries, please use GEMA chat or visit the society office during business hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
