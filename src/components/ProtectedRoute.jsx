import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requirePurchase = null }) {
    const { user, hasPurchased } = useAuth();
    const location = useLocation();

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if email is verified (skip for verify-email page itself)
    if (!user.emailVerified && location.pathname !== '/verify-email') {
        return <Navigate to="/verify-email" replace />;
    }

    // Check if purchase is required
    if (requirePurchase && !hasPurchased(requirePurchase)) {
        return <Navigate to={`/product/${requirePurchase}`} replace />;
    }

    return children;
}

export default ProtectedRoute;
