import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletProviderComponent from "./components/WalletProvider";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks';
import Leaderboard from './pages/Leaderboard';
import ForgotPassword from './pages/ForgotPassword';
import AuthRedirect from './components/AuthRedirect';
import NotFound from './pages/Notfound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import TelegramRedirect from "./pages/TelegramRedirect"
import PhantomRedirect from './pages/PhantomRedirect';



const App = () => {


    return (

        <div>

            <Router>
                <Routes>

                    <Route path="/" element={
                        <Landing />
                    } />


                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <AuthRedirect signin_up={false}>
                            <WalletProviderComponent>
                                <Dashboard />
                            </WalletProviderComponent>
                        </AuthRedirect>
                    } />


                    <Route path="/tasks" element={
                        <AuthRedirect signin_up={false}>
                            <WalletProviderComponent>
                                <Tasks />
                            </WalletProviderComponent>
                        </AuthRedirect>
                    } />

                    <Route path="/leaderboard" element={
                        <AuthRedirect signin_up={false}>
                            <Leaderboard />
                        </AuthRedirect>
                    } />

                    <Route path="/phantom-redirect" element={
                        <AuthRedirect signin_up={false}>
                            <PhantomRedirect />
                        </AuthRedirect>
                    } />

                    {/* Protected Routes */}


                    <Route path="/signin" element={
                        <AuthRedirect signin_up={true}>
                            <Signin />
                        </AuthRedirect>
                    } />


                    <Route path="/register" element={
                        <AuthRedirect signin_up={true}>
                            <Register />
                        </AuthRedirect>
                    } />

                    <Route path="/forgot-password" element={
                        <AuthRedirect signin_up={true}>
                            <ForgotPassword />
                        </AuthRedirect>
                    } />


                    <Route path="/telegram-redirect" element={<TelegramRedirect />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>


        </div>
    );
};


export default App;
