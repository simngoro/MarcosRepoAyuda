passport.use(new GitHubStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: 'http://your-app-url/auth/github/callback',
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ githubId: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }
     //que pasa si el usario no existe?
      const newUser = new User({
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
      
      });
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        return done(null, newUser);
      });
    });
  }));
  