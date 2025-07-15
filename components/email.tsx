import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const Email = ({ brandKit }) => (
  <Html>
    <Head />
    <Preview>Your Brand Kit Preview</Preview>
    <Body style={{ backgroundColor: brandKit.colors.background }}>
      <Container
        style={{
          backgroundColor: brandKit.colors.container,
          color: brandKit.colors.foreground,
          padding: "20px",
        }}
      >
        {brandKit.logos.primary && (
          <Section>
            <Img src={brandKit.logos.primary} alt="Primary Logo" width="150" />
          </Section>
        )}
        <Section>
          <Text>Kit Name: {brandKit.kitName}</Text>
          <Text>Website: {brandKit.website}</Text>
          <Text>Brand Summary: {brandKit.brandSummary}</Text>
          <Text>Address: {brandKit.address}</Text>
          <Text>Tone of Voice: {brandKit.toneOfVoice}</Text>
        </Section>
        <Section>
          <Button
            style={{
              backgroundColor: brandKit.colors.accent,
              color: brandKit.colors.buttonText,
              padding: "10px 20px",
              borderRadius: "5px",
            }}
          >
            Click Me
          </Button>
        </Section>
        <Section>
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {brandKit.copyright}
          </Text>
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {brandKit.footer}
          </Text>
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {brandKit.disclaimers}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);