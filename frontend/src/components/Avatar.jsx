import { useState } from "react";

const Avatar = ({ name = "", imageUrl = "", size = "40" }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = () => {
    const words = name.split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.2}px`,
        backgroundColor: "#f0f0f0",
      }}
    >
      {!imgError && imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

export default Avatar;
