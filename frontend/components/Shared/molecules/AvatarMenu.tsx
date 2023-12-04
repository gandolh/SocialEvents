'use client';
import md5 from 'md5';
import Button from "@/components/Shared/atoms/Button";
import Avatar from "@/components/Shared/atoms/Avatar";
import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
// import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { SocialEventsUser } from '@/types/SocialEventsUser';
import styles from '@/styles/Sidebar.module.css';


const LazyModalMap = 
dynamic(() => import('@/components/Modals/organisms/ModalMap'));
const LazyModalMyProfile = 
dynamic(() => import('@/components/Modals/organisms/ModalMyProfile'));
const LazyModalAdminPanel = 
dynamic(() => import('@/components/Modals/organisms/ModalAdminPanel'));
const LazyModalSettings = 
dynamic(() => import('@/components/Modals/organisms/ModalSettings'));
const AvatarMenu = () => {
  const gravatarUrl = 'https://gravatar.com/avatar/';
  // const locale = useLocale();
  const tradText = (a)=> a //useTranslations('Misc');
  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    "name": "Bonnie Green",
    "email": "BonnieGree@e-uvt.ro",
    isAdmin: false,
  } as SocialEventsUser);
  const [open, setOpen] = useState<boolean>(false);
  const [pfp, setPfp] = useState<string>(gravatarUrl);
  const [OpenAdminPanel, setOpenAdminPanel] = useState<boolean>(false);
  const [openMyProfile, setOpenMyProfile] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openMap, setOpenMap] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user);
      setPfp(gravatarUrl + md5(session?.user?.email));
    }
  }, [status, session]);

  const logout = () => { signOut(); }
  const handleLogin = () => { router.push(`/login`); }
  const handleOpen = () => { setOpen(!open); }
  const handleOpenAdminPanel = () => { setOpenAdminPanel((prev) => !prev); }
  const handleOpenMyProfile = () => { setOpenMyProfile((prev) => !prev); }
  const handleOpenMap = () => { setOpenMap((prev) => !prev); }
  const handleOpenSettings = () => { setOpenSettings((prev) => !prev); }


  return (<>
    {status == "authenticated" &&
      <div className="flex flex-col h-full" onClick={handleOpen}>
        <Avatar name={user?.name} src={pfp} />
        <div id="menuOptions"
          className={styles.menu__options + " " + (!open ? "hidden" : "")}>
          <div className="px-4 py-3 text-sm text-gray-900 ">
            <div>{user?.email}</div>
            <div className="font-medium truncate"></div>
          </div>
          <ul className="py-2 text-sm text-gray-700 " aria-labelledby="avatarButton">
            <li>
              <a href={`/calendar/all`} className="block px-4 py-2 hover:bg-gray-100 ">{tradText('MyEvents')}</a>
            </li>
            <li>
              <a onClick={handleOpenMyProfile} className="block px-4 py-2 hover:bg-gray-100">{tradText('MyProfile')}</a>
            </li>
            <li>
              <a onClick={handleOpenMap} className="block px-4 py-2 hover:bg-gray-100 ">{tradText('Maps')}</a>
            </li>
           {user?.isAdmin &&  <li>
              <a onClick={handleOpenAdminPanel} className="block px-4 py-2 hover:bg-gray-100">{tradText('Administration')}</a>
            </li>}
            <li>
              <a onClick={handleOpenSettings} className="block px-4 py-2 hover:bg-gray-100">{tradText('Settings')}</a>
            </li>
          </ul>
          <div className="py-1">
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={logout}
            >
              {tradText('SignOut')}</a>
          </div>
        </div>
      </div>
    }
    {status != "authenticated" &&
      <div className="flex items-center justify-around">
        <Button onClick={handleLogin} className="w-full mx-4" > {tradText('Login')}</Button>
      </div>
    }


    {openMap && <LazyModalMap handleOpen={handleOpenMap} open={openMap} showAll={true}/>}
    {openMyProfile && <LazyModalMyProfile handleOpen={handleOpenMyProfile} open={openMyProfile} />}
    {OpenAdminPanel && <LazyModalAdminPanel handleOpen={handleOpenAdminPanel} open={OpenAdminPanel} />}
    {openSettings && <LazyModalSettings handleOpen={handleOpenSettings} open={openSettings} title={"Settings"} />}
  </>);
}

export default AvatarMenu;
