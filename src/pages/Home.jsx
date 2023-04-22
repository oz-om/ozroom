import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Rooms } from "../components/home/Rooms";
import { SearchBar } from "../components/home/SearchBar";
import { SideToggle } from "../components/home/SideToggle";
import { useAppState } from "../state";

export const Home = () => {
  const { loggedIn } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    } else if (location.pathname === "/") {
      navigate("/explore");
    } else {
      navigate(location.pathname);
    }
  }, [loggedIn]);

  return (
    <section className='grid lg:grid-cols-[1fr_auto] min-h-[calc(100vh_-_70px)] relative'>
      {loggedIn && (
        <>
          <div className='relative'>
            {(location.pathname === "/rooms" || location.pathname === "/explore") && (
              <>
                <SideToggle />
                <SearchBar />
              </>
            )}
            <Rooms />
          </div>
        </>
      )}
    </section>
  );
};
