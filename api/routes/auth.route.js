import express from 'express';
import { signin, signup, google, signout, googleCallback } from '../controllers/auth.controller.js';
import passport from 'passport';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

// Google OAuth server-side flow via Passport
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  passport.authenticate("google", {
    failureRedirect: `${clientUrl}/sign-in?error=google_auth_failed`,
  })(req, res, next);
}, googleCallback);

// Legacy: client-side Google auth (POST)
router.post("/google", google);

export default router;