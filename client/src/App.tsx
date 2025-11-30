import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Citizen Pages
import CitizenDashboard from "@/pages/Citizen/Dashboard";
import CitizenTimeline from "@/pages/Citizen/Timeline";
import CitizenSchemes from "@/pages/Citizen/Schemes";
import MemberDetail from "@/pages/Citizen/MemberDetail";

// Doctor Pages
import DoctorSearch from "@/pages/Doctor/Search";
import PatientRecord from "@/pages/Doctor/PatientRecord";
import AddNotes from "@/pages/Doctor/AddNotes";

// ASHA Pages
import HouseholdUpdates from "@/pages/Asha/HouseholdUpdates";
import WardMembers from "@/pages/Asha/WardMembers";
import EditHousehold from "@/pages/Asha/EditHousehold";
import AddMember from "@/pages/Asha/AddMember";
import SubmitForm from "@/pages/Asha/SubmitForm";
import CsvUpload from "@/pages/Asha/CsvUpload";

// Gov Pages
import GovernmentDashboard from "@/pages/Government/Dashboard";
import Alerts from "@/pages/Government/Alerts";
import AdminPanel from "@/pages/Government/AdminPanel";
import WardManagement from "@/pages/Government/WardManagement";

// Public Pages
import Categories from "@/pages/Categories";
import HowItWorks from "@/pages/HowItWorks";
import HospitalNetwork from "@/pages/HospitalNetwork";
import PublicPortal from "@/pages/PublicPortal";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={Categories} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/hospitals" component={HospitalNetwork} />
        <Route path="/check-uhc" component={PublicPortal} />
        
        {/* Citizen Routes */}
        <Route path="/citizen/dashboard">
          <ProtectedRoute component={CitizenDashboard} allowedRoles={['citizen']} />
        </Route>
        <Route path="/citizen/timeline">
          <ProtectedRoute component={CitizenTimeline} allowedRoles={['citizen']} />
        </Route>
        <Route path="/citizen/schemes">
          <ProtectedRoute component={CitizenSchemes} allowedRoles={['citizen']} />
        </Route>
        <Route path="/citizen/member/:memberId">
          <ProtectedRoute component={MemberDetail} allowedRoles={['citizen']} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor/search">
          <ProtectedRoute component={DoctorSearch} allowedRoles={['doctor']} />
        </Route>
        <Route path="/doctor/record">
          <ProtectedRoute component={PatientRecord} allowedRoles={['doctor']} />
        </Route>
        <Route path="/doctor/add-notes">
          <ProtectedRoute component={AddNotes} allowedRoles={['doctor']} />
        </Route>

        {/* ASHA Routes */}
        <Route path="/asha/households">
          <ProtectedRoute component={HouseholdUpdates} allowedRoles={['asha']} />
        </Route>
        <Route path="/asha/members">
          <ProtectedRoute component={WardMembers} allowedRoles={['asha']} />
        </Route>
        <Route path="/asha/edit/:id">
          <ProtectedRoute component={EditHousehold} allowedRoles={['asha']} />
        </Route>
        <Route path="/asha/add-member/:id">
          <ProtectedRoute component={AddMember} allowedRoles={['asha']} />
        </Route>
        <Route path="/asha/submit">
          <ProtectedRoute component={SubmitForm} allowedRoles={['asha']} />
        </Route>
        <Route path="/asha/upload">
          <ProtectedRoute component={CsvUpload} allowedRoles={['asha']} />
        </Route>

        {/* Government Routes */}
        <Route path="/gov/dashboard">
          <ProtectedRoute component={GovernmentDashboard} allowedRoles={['gov']} />
        </Route>
        <Route path="/gov/alerts">
          <ProtectedRoute component={Alerts} allowedRoles={['gov']} />
        </Route>
        <Route path="/gov/admin">
          <ProtectedRoute component={AdminPanel} allowedRoles={['gov']} />
        </Route>
        <Route path="/gov/wards">
          <ProtectedRoute component={WardManagement} allowedRoles={['gov']} />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
