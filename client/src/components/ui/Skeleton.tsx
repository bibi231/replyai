import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    rounded?: boolean;
    className?: string;
}

export function Skeleton({ width = '100%', height = 16, rounded = false, className = '' }: SkeletonProps) {
    return (
        <div
            className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
            style={{ width, height }}
            aria-hidden
        />
    );
}

export function ReplyCardSkeleton() {
    return (
        <div className="reply-card-skeleton">
            <div className="reply-card-skeleton-header">
                <Skeleton width={100} height={20} />
                <Skeleton width={40} height={20} />
            </div>
            <Skeleton width="70%" height={14} className="mt-2" />
            <Skeleton height={12} className="mt-3" />
            <Skeleton height={12} className="mt-2" />
            <Skeleton width="85%" height={12} className="mt-2" />
            <Skeleton height={12} className="mt-2" />
            <Skeleton width="60%" height={12} className="mt-2" />
        </div>
    );
}
