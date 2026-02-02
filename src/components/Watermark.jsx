import { useAuth } from '../context/AuthContext';

function Watermark() {
    const { user } = useAuth();

    if (!user) return null;

    // Create multiple watermark instances
    const watermarks = [];
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 5; col++) {
            watermarks.push({
                id: `${row}-${col}`,
                top: `${row * 12 + 5}%`,
                left: `${col * 25 - 10}%`,
            });
        }
    }

    return (
        <div className="watermark">
            {watermarks.map(({ id, top, left }) => (
                <span
                    key={id}
                    className="watermark-text"
                    style={{ top, left }}
                >
                    {user.email}
                </span>
            ))}
        </div>
    );
}

export default Watermark;
