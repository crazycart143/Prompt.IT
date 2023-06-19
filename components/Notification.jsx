"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Notification = () => {
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [viewed, setViewed] = useState(false);

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

          // Count the number of unviewed notifications
          const unviewedNotificationsCount = data.filter(
            (notification) => !notification.viewed
          ).length;
          setNotificationCount(unviewedNotificationsCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (session?.user.id) fetchNotifications();
  }, [session?.user.id]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const getTimeAgo = (createdAt) => {
    const currentTime = new Date();
    const createdTime = new Date(createdAt);
    const timeElapsed = currentTime - createdTime;
    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  const handleNotificationClick = async () => {
    if (!viewed) {
      try {
        // Check if any unviewed notifications exist
        const unviewedNotifications = notifications.filter(
          (notification) => !notification.viewed
        );

        if (unviewedNotifications.length > 0) {
          const response = await fetch(
            `/api/users/${session?.user.id}/notifications/update`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            setViewed(true);
          } else {
            console.log("error updating the notification");
          }
        }
      } catch (error) {
        // Handle fetch error
        console.error(error);
      }
    }
  };

  return (
    <div className="relative flex-center">
      <button
        className="relative cursor-pointer flex-center"
        onClick={() => {
          setNotificationDropdown(!notificationDropdown);
          handleNotificationClick();
        }}
      >
        {notificationCount > 0 && !viewed && (
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
        <div className="z-50 notification">
          <h3 className="mt-5 text-[24px] font-extrabold leading-[1.15] text-black">
            Notifications
          </h3>
          {notifications && notifications.length > 0 ? (
            notifications.reverse().map((notification) => (
              <div
                className="flex items-center justify-center gap-x-4"
                key={notification._id}
              >
                <img
                  src={notification.profilePicture}
                  alt={notification._id}
                  width={56}
                  height={56}
                  className="rounded-full w-[56px] h-[56px]"
                />
                <div className="flex flex-col gap-y-2 md:gap-0">
                  <h1 className="text-[14px]">
                    {truncateText(notification.message, 94)}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
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
