<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" role="navigation" aria-label="Main navigation">
    <div class="container-fluid">
      <!-- Brand/Logo -->
      <router-link to="/MainDash" class="navbar-brand">
        <span class="brand-text">Library System</span>
      </router-link>

      <!-- Mobile toggle button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
        @click="toggleMobileMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav" :class="{ 'show': showMobileMenu }">
        <ul class="navbar-nav ms-auto">
          <li 
            v-for="item in navigationItems" 
            :key="item.path" 
            class="nav-item"
          >
            <router-link 
              :to="item.path" 
              class="nav-link btn-nav"
              :class="{ 'active': $route.path === item.path }"
              :aria-label="item.ariaLabel"
              @click="closeMobileMenu"
            >
              <i :class="item.icon" aria-hidden="true"></i>
              <span class="nav-text">{{ item.text }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      showMobileMenu: false
    }
  },
  computed: {
    // Reactive role from store
    userRole() {
      return this.$store.state.Role || '';
    },
    
    // Dynamic navigation items based on role
    navigationItems() {
      const baseItems = [
        {
          path: '/MainDash',
          text: 'Home',
          icon: 'fas fa-home',
          ariaLabel: 'Go to home page',
          roles: ['Admin', 'student', 'lecturer']
        }
      ];

      const roleSpecificItems = {
        Admin: [
          {
            path: '/Notification',
            text: 'Notifications',
            icon: 'fas fa-bell',
            ariaLabel: 'View notifications'
          },
          {
            path: '/Users',
            text: 'All Users',
            icon: 'fas fa-users',
            ariaLabel: 'Manage all users'
          }
        ]
      };

      const logoutItem = {
        path: '/logout',
        text: 'Logout',
        icon: 'fas fa-sign-out-alt',
        ariaLabel: 'Logout from the system'
      };

      // Build navigation based on role
      let items = [...baseItems];
      
      if (roleSpecificItems[this.userRole]) {
        items = items.concat(roleSpecificItems[this.userRole]);
      }
      
      // Add logout for all authenticated users
      if (this.userRole) {
        items.push(logoutItem);
      }

      return items;
    }
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    
    closeMobileMenu() {
      this.showMobileMenu = false;
    },

    // Handle route changes to close mobile menu
    handleRouteChange() {
      this.closeMobileMenu();
    }
  },
  
  watch: {
    // Watch for route changes to close mobile menu
    '$route'() {
      this.handleRouteChange();
    }
  }
}
</script>
<style scoped>
.navbar {
  margin-bottom: 30px;
  background-color: #dee2e6 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.navbar-brand {
  font-weight: 600;
  color: #333 !important;
  text-decoration: none;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-brand:hover {
  color: #007bff !important;
}

.nav-link {
  display: flex !important;
  align-items: center;
  padding: 0.5rem 1rem !important;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  text-decoration: none !important;
  color: #495057 !important;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #007bff !important;
  transform: translateY(-1px);
}

.nav-link.active {
  background-color: #007bff;
  color: white !important;
}

.nav-link i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.nav-text {
  font-size: 0.95rem;
}

/* Mobile responsiveness */
@media (max-width: 991.98px) {
  .navbar-nav {
    text-align: center;
    padding-top: 1rem;
  }
  
  .nav-link {
    margin: 0.25rem 0;
    justify-content: center;
  }
  
  .navbar-toggler {
    border: none;
    padding: 0.25rem 0.5rem;
  }
  
  .navbar-toggler:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}

/* Accessibility improvements */
.nav-link:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.navbar-toggler:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Animation for mobile menu */
.navbar-collapse {
  transition: all 0.3s ease-in-out;
}

/* Loading state for better UX */
.nav-link.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Active route indicator */
.router-link-active {
  background-color: #007bff;
  color: white !important;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .navbar {
    border-bottom: 2px solid #000;
  }
  
  .nav-link {
    border: 1px solid transparent;
  }
  
  .nav-link:hover,
  .nav-link:focus {
    border-color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nav-link,
  .navbar-collapse {
    transition: none;
  }
  
  .nav-link:hover {
    transform: none;
  }
}
</style>
