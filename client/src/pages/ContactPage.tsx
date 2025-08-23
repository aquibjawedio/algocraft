import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          Have a question, feedback, or just want to say hi? We’d love to hear
          from you. Fill out the form below or reach us through our contact
          details.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
        <Card className="shadow-md bg-muted/20">
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground text-sm">
                  support@algocraft.tech
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground text-sm">+1234567890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-muted-foreground text-sm">
                  AlgoCraft, India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-muted/20">
          <CardContent className="p-8">
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Write your message..."
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="mt-2 rounded-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactPage;
