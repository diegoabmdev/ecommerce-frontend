import React from "react";
import { Badge } from "../ui/badge";

interface TittlesProps {
  title: string;
  badge: string;
}

const Tittles = ({ title, badge }: TittlesProps) => {
  return (
    <div>
      <Badge className="bg-orange-500 hover:bg-orange-600 mb-3 uppercase tracking-tighter">
        {badge}
      </Badge>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
        <span className="text-indigo-600">{badge}</span> {title}
      </h2>
    </div>
  );
};

export default Tittles;
