import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PaymentButton({
    amount,
    productName,
    productId,
    onSuccess,
    onFailure,
    type = 'mindmap', // 'mindmap', 'bundle', 'credits'
    credits = 0,
    buttonText = 'Pay Now',
    className = 'btn btn-primary'
}) {
    const { user, purchaseItem, addPredictorCredits } = useAuth();
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    const handlePayment = () => {
        if (!user) {
            // Redirect to login with return url
            navigate('/login');
            return;
        }

        // Navigate to dedicated payment gateway page
        const params = new URLSearchParams({
            id: productId,
            product: productName,
            amount: amount,
            type: type,
            credits: credits // Only for credit purchases
        });

        navigate(`/payment?${params.toString()}`);
    };

    // Remove old handleRazorpayPayment and simulatePayment logic as it's now centralized in PaymentGatewayPage

    return (
        <button
            className={className}
            onClick={handlePayment}
            disabled={processing}
        >
            {processing ? (
                <>
                    <span className="spinner" style={{ width: 16, height: 16 }}></span>
                    Processing...
                </>
            ) : (
                <>
                    {buttonText} - ₹{amount}
                </>
            )}
        </button>
    );
}

export default PaymentButton;
