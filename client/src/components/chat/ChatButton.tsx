import { MessageCircle } from "lucide-react";


export default function ChatButton({ onClick }: { onClick: () => void }) {
return (
<button
onClick={onClick}
className="chat-button"
>
<MessageCircle size={28} color="#fff" />
</button>
);
};