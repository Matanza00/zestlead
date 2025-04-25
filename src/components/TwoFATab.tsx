// components/TwoFATab.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

export default function TwoFATab() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [qr, setQr] = useState<string>();
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string>();

  // 1️⃣ On mount, fetch current 2FA status
  useEffect(() => {
    if (!session) return;
    fetch("/api/2fa/status")
      .then((r) => r.json())
      .then((data) => {
        setEnabled(data.enabled);
        if (!data.enabled) generateQr();
      });
  }, [session]);

  // 2️⃣ Generate (or regenerate) a new secret + QR
  const generateQr = async () => {
    setLoading(true);
    const res = await fetch("/api/2fa/generate");
    const { qr: qrUrl } = await res.json();
    setQr(qrUrl);
    setLoading(false);
  };

  // 3️⃣ Verify code & enable
  const handleEnable = async () => {
    setLoading(true);
    const res = await fetch("/api/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setEnabled(true);
      setMessage("🎉 Two-factor authentication enabled!");
    } else {
      const err = await res.json();
      setMessage(err.error || "Invalid code, try again");
    }
    setLoading(false);
  };

  // 4️⃣ Disable 2FA
  const handleDisable = async () => {
    setLoading(true);
    const res = await fetch("/api/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setEnabled(false);
      setToken("");
      setQr(undefined);
      setMessage("Two-factor authentication disabled");
      generateQr();
    } else {
      const err = await res.json();
      setMessage(err.error || "Invalid code, try again");
    }
    setLoading(false);
  };

  if (!session) return <Typography>Loading user…</Typography>;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Two-Factor Authentication
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {!loading && enabled && (
          <>
            <Typography color="success.main">
              ✓ 2FA is currently <strong>enabled</strong>.
            </Typography>
            <Typography mt={2}>
              To disable, enter a current code from your Authenticator app:
            </Typography>
            <TextField
              label="6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              sx={{ mt: 1, mb: 2, width: "150px" }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDisable}
              disabled={loading || token.length !== 6}
            >
              Disable 2FA
            </Button>
          </>
        )}

        {!loading && !enabled && (
          <>
            <Typography>
              Scan this QR code with Google Authenticator (or similar), then
              enter the 6-digit code below to enable:
            </Typography>
            {qr && (
              <Box my={2}>
                <img src={qr} alt="Scan this QR with Authenticator" />
              </Box>
            )}
            <TextField
              label="6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              sx={{ mt: 1, mb: 2, width: "150px" }}
            />
            <Button
              variant="contained"
              onClick={handleEnable}
              disabled={loading || token.length !== 6}
            >
              Enable 2FA
            </Button>
            <Button
              variant="text"
              onClick={generateQr}
              disabled={loading}
              sx={{ ml: 2 }}
            >
              Regenerate QR
            </Button>
          </>
        )}

        {message && (
          <Typography mt={2} color={message.startsWith("🎉") ? "success.main" : "error.main"}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
