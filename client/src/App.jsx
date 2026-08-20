import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <Card className="w-[420px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🚀 Welcome to HabitFlow</CardTitle>
          <CardDescription>
            Your journey to better habits starts here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Track your daily tasks, build lasting habits, and achieve your
            goals.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="default">Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
