export default function AnimatedBackground({ faded = false }) {
  return (
    <div className={`home-bg${faded ? ' faded' : ''}`} aria-hidden="true">
      <div className="bg-contours">
        <svg viewBox="0 0 2880 900" preserveAspectRatio="none">
          <path className="accent" d="M0 340 C 360 470 480 200 720 290 S 1080 490 1440 340 M1440 340 C 1800 470 1920 200 2160 290 S 2520 490 2880 340" />
          <path className="soft" d="M0 150 C 360 80 720 230 1080 170 S 1440 110 1800 200 S 2160 110 2520 190 S 2880 130 2880 190" />
          <path className="ink" d="M0 480 C 420 320 560 620 840 540 S 1140 330 1440 480 M1440 480 C 1860 320 2000 620 2280 540 S 2580 330 2880 480" />
          <path className="soft" d="M0 620 C 300 540 520 700 840 660 S 1080 500 1440 620 M1440 620 C 1740 540 1960 700 2280 660 S 2520 500 2880 620" />
          <path className="ink" d="M0 760 C 420 780 840 690 1260 730 S 1740 800 2160 740 S 2520 690 2880 750" />
        </svg>
      </div>
      <div className="bg-sun" />
    </div>
  )
}