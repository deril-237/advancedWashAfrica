"use client";

import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  GraduationCap,
  Waves,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import {
  ModalContentType,
  ModalRoot,
} from "@/components/molecules/modal/ModalRoot";
import { logoutAction } from "@/features/auth/actions";
import { useSession } from "@/lib/betterAuth/auth-client";

export function UserDropDown() {
  const { data, isPending } = useSession();

  return (
    <div>
      {isPending ? (
        <div className="skeleton size-10 rounded-full"> </div>
      ) : (
        <div>
          <button
            className="btn btn-circle btn-secondary"
            popoverTarget="popover-profile"
            style={
              { anchorName: "--anchor-profile" } /* as React.CSSProperties */
            }
          >
            <span className="capitalize">{data?.user.name.split("")[0]}</span>
          </button>

          <ul
            className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm space-y-2"
            popover="auto"
            id="popover-profile"
            style={
              {
                positionAnchor: "--anchor-profile",
              } /* as React.CSSProperties */
            }
          >
            <li>
              <Link
                href={"/admin"}
                className="btn btn-sm btn-soft btn-info hover:text-white"
              >
                <User size={20} /> Tableau de bord
              </Link>
            </li>
            <li>
              <button
                className="btn btn-sm btn-soft btn-warning hover:text-white"
                onClick={() => logoutAction()}
              >
                <LogOut size={20} /> Se deconnecter
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
