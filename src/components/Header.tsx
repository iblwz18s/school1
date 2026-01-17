import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="bg-background py-3 px-4 border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-primary">ابتدائية سعد بن أبي وقاص</h1>
          <p className="text-xs text-muted-foreground">اختبارات محاكية لاختبارات نافس</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
