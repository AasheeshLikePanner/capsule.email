import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeInfo, Building, Palette, FileText, Users } from 'lucide-react';

export default function BrandKitForm({ brandKit, setBrandKit }:any) {
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setBrandKit({ ...brandKit, [name]: value });
  };

  const handleColorChange = (e:any) => {
    const { name, value } = e.target;
    setBrandKit({ ...brandKit, colors: { ...brandKit.colors, [name]: value } });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4 section-gap">
        <Card id="brand-details">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building size={20}/> Brand Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="kitName">Kit Name</Label>
              <Input
                id="kitName"
                name="kitName"
                value={brandKit.kitName}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={brandKit.website}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="brandSummary">Brand Summary</Label>
              <Textarea
                id="brandSummary"
                name="brandSummary"
                value={brandKit.brandSummary}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={brandKit.address}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="toneOfVoice">Tone of Voice</Label>
              <Input
                id="toneOfVoice"
                name="toneOfVoice"
                value={brandKit.toneOfVoice}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 section-gap">
        <Card id="legal">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText size={20}/> Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div>
              <Label htmlFor="copyright">Copyright</Label>
              <Input
                id="copyright"
                name="copyright"
                value={brandKit.copyright}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="footer">Footer</Label>
              <Textarea
                id="footer"
                name="footer"
                value={brandKit.footer}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="disclaimers">Disclaimers</Label>
              <Textarea
                id="disclaimers"
                name="disclaimers"
                value={brandKit.disclaimers}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
        <Card id="social">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users size={20}/> Social</CardTitle>
          </CardHeader>
          <CardContent>
          <Input
                id="socials"
                name="socials"
                value={brandKit.socials}
                onChange={handleInputChange}
                className="rounded-lg"
                placeholder="Add your social links here"
              />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 section-gap">
        <Card id="logos">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BadgeInfo size={20}/> Logos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryLogo">Primary</Label>
              <Input id="primaryLogo" type="file" className="rounded-lg"/>
            </div>
            <div>
              <Label htmlFor="iconLogo">Icon</Label>
              <Input id="iconLogo" type="file" className="rounded-lg"/>
            </div>
          </CardContent>
        </Card>
        <Card id="colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette size={20}/> Colors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                name="background"
                value={brandKit.colors.background}
                onChange={handleColorChange}
                className="rounded-lg"
              />
              <Label>Background</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                name="container"
                value={brandKit.colors.container}
                onChange={handleColorChange}
                className="rounded-lg"
              />
              <Label>Container</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                name="accent"
                value={brandKit.colors.accent}
                onChange={handleColorChange}
                className="rounded-lg"
              />
              <Label>Accent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                name="buttonText"
                value={brandKit.colors.buttonText}
                onChange={handleColorChange}
                className="rounded-lg"
              />
              <Label>Button Text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                name="foreground"
                value={brandKit.colors.foreground}
                onChange={handleColorChange}
                className="rounded-lg"
              />
              <Label>Foreground</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
