 import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js';
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
    import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js';

    const firebaseConfig = {
      apiKey: "AIzaSyC9HOOsT5ynGk4I0PlBnhMUFaxdMr0GC3A",
      authDomain: "gangasolvo.firebaseapp.com",
      databaseURL: "https://gangasolvo-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "gangasolvo",
      storageBucket: "gangasolvo.appspot.com",
      messagingSenderId: "16985429162",
      appId: "1:16985429162:web:3d77dafc70cbda944b6cd3",
      measurementId: "G-B0616MY411"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);

    // Function to save data to the database
    function saveDataToDatabase(userId, key, data) {
      const userRef = ref(database, `users/${userId}/pages/${key}`);
      set(userRef, data)
        .then(() => {
          console.log('Data saved successfully to database');
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    }

    // Function to load data from the database
    function loadDataFromDatabase(userId, key) {
      const dbRef = ref(database);
      get(child(dbRef, `users/${userId}/pages/${key}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            localStorage.setItem(key, JSON.stringify(data));
            console.log('Data loaded from database:', data);
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error('Error loading data:', error);
        });
    }

    // Check user authentication status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get full name from user's displayName
        const fullName = user.displayName || '';
        const firstName = fullName.split(' ')[0] || 'User';

        // Display user info
        document.getElementById('userFullName').textContent = fullName;
        document.getElementById('userFirstName').textContent = firstName;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userPhoto').src = user.photoURL || 'default-profile.png';
        document.getElementById('googleSignOutBtn').style.display = 'inline-block';

        // Load user data from the database for each page
        const pages = ['page1', 'page2', 'page3']; // Example page identifiers
        pages.forEach(page => {
          loadDataFromDatabase(user.uid, page);
        });

      } else {
        // No user is signed in, redirect to login page
        window.location.href = '../../../signin.html';
      }
    });

    // Detect changes in local storage and save to the database
    window.addEventListener('storage', (event) => {
      const user = auth.currentUser;
      if (user) {
        saveDataToDatabase(user.uid, event.key, JSON.parse(event.newValue));
      }
    });

    // Sign out button event listener
    document.getElementById('googleSignOutBtn').addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          console.log('User signed out');
          window.location.href = '../../../signin.html';
        })
        .catch((error) => {
          console.error('Error during sign-out:', error);
        });
    });

