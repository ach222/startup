import React from "react";
import "./css/notification.css";

export default function Notification({ text, onClose }) {
  return (
    <div className="notification">
      <div className="close-btn">
        <a href="#" onClick={onClose}>
          Close
        </a>
      </div>
      <div>{text}</div>
    </div>
  );
}
