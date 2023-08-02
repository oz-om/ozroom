import { useEffect, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Rooms } from "../components/home/Rooms";
import { SearchBar } from "../components/home/SearchBar";
import { SideToggle } from "../components/home/SideToggle";
import { useAppState } from "../context";
import { Loader } from "../components/global/Loader";

function Home() {
  const { loggedIn } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn.state && !loggedIn.waiting) {
      navigate("/login");
    } else if (location.pathname === "/" && loggedIn.state && !loggedIn.waiting) {
      navigate("/explore");
    } else {
      navigate(location.pathname);
    }
  }, [loggedIn]);

  return (
    <section>
      {!loggedIn.waiting ? (
        <>
          <div className=' wrapper grid'>
            {(location.pathname === "/rooms" || location.pathname === "/explore") && (
              <>
                <SideToggle />
                <SearchBar />
              </>
            )}
            <Rooms />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </section>
  );
}

export default memo(Home);
