"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Notification = () => {
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/users/${session?.user.id}/notifications`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          setNotificationCount(data.length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (session?.user.id) fetchNotifications();
  }, [session?.user.id]);

  console.log(notifications);

  return (
    <div className="relative flex-center">
      <button
        className="relative cursor-pointer flex-center"
        onClick={() => setNotificationDropdown(!notificationDropdown)}
      >
        {notificationCount > 0 && (
          <div className="bg-black rounded-full w-[24px] h-[24px] absolute -right-2 top-0 text-white text-[10px] flex-center">
            {notificationCount}
          </div>
        )}

        <Image
          src="/assets/icons/notification-icon.svg"
          height={32}
          width={32}
          alt="notification-icon"
        />
      </button>
      {notificationDropdown && (
        <div className="notification">
          <h3 className="mt-5 text-[24px] font-extrabold leading-[1.15] text-black">
            Notification
          </h3>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id}>
                <h1>{notification.message}</h1>
              </div>
              // Display other relevant information from the notification object
            ))
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
