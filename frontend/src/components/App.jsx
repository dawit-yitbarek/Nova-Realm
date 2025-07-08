import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletProviderComponent from "./WalletProvider";
import Signin from "./Signin";
import Register from "./Register";
import Landing from "./Landing";
import Dashboard from './Dashboard'
import Tasks from './Tasks';
import Leaderboard from './Leaderboard';
import ForgotPassword from './ForgotPassword';
import AuthRedirect from './AuthRedirect';
import NotFound from './Notfound';
import Terms from './Terms';
import Privacy from './Privacy';
import TelegramRedirect from "./TelegramRedirect"
import Ping from './Ping'
import PhantomRedirect from './PhantomRedirect';



const App = () => {


    return (

        <div>

            <Router>
                <Routes>

                    <Route path="/" element={
                        <Landing />
                    } />

                    {/* A component to wake the app every 5 minute */}
                    <Route path="/ping" element={<Ping />} />


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
