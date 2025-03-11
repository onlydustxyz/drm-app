"use client";

import { useState } from "react";

export default function ContributorAvatar({ name, avatar }: { name: string; avatar: string }) {
	const [imgSrc, setImgSrc] = useState(avatar);

	const handleError = () => {
		setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`);
	};

	return (
		<div className="h-8 w-8 rounded-full overflow-hidden">
			<img src={imgSrc} alt={name} className="h-full w-full object-cover" onError={handleError} />
		</div>
	);
}
