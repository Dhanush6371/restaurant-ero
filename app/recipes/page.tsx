'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { recipes } from '@/lib/mock-data';
import type { Recipe } from '@/types';
import {
  ArrowLeft, Clock, Users, TrendingUp, Percent, Euro, ChefHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function RecipesPage() {
  const [selected, setSelected] = useState<Recipe | null>(null);

  if (selected) {
    const totalCost = selected.totalFoodCost;
    const maxCost = Math.max(...selected.ingredients.map((i) => i.cost));

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-serif text-2xl font-semibold">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">Recipe & Food Cost Analysis</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Key metrics */}
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Selling Price</p>
              <p className="mt-2 text-3xl font-bold">€{selected.sellingPrice.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Food Cost</p>
              <p className="mt-2 text-3xl font-bold">€{selected.totalFoodCost.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Gross Profit</p>
              <p className="mt-2 text-3xl font-bold text-success">€{selected.grossProfit.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Ingredients breakdown */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Ingredients & Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.ingredients.map((ing, i) => {
                const pct = (ing.cost / totalCost) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{ing.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{ing.quantity}</span>
                      </div>
                      <span className="font-semibold">€{ing.cost.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: chartColors[i % chartColors.length] }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold">Total Food Cost</span>
                <span className="text-lg font-bold">€{totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Food cost percentage */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Food Cost Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="hsl(var(--chart-1))" strokeWidth="8"
                      strokeDasharray={`${selected.foodCostPct * 2.83} ${283 - selected.foodCostPct * 2.83}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold">{selected.foodCostPct.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Food Cost</p>
                  </div>
                </div>
                <div className="mt-6 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="text-lg font-semibold text-success">{(100 - selected.foodCostPct).toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Profit Ratio</p>
                    <p className="text-lg font-semibold">{((selected.grossProfit / selected.sellingPrice) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe info */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recipe Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Prep Time</p>
                  <p className="font-medium">{selected.prepTime} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Servings</p>
                  <p className="font-medium">{selected.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Station</p>
                  <p className="font-medium">{selected.station}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Recipes & Food Cost" description="Analyze recipe costs and profitability" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => setSelected(recipe)}
            className="text-left"
          >
            <Card className="border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-5">
                <p className="font-serif text-lg font-semibold">{recipe.name}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Selling Price</span>
                    <span className="font-semibold">€{recipe.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Food Cost</span>
                    <span className="font-semibold">€{recipe.totalFoodCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gross Profit</span>
                    <span className="font-semibold text-success">€{recipe.grossProfit.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Food Cost: {recipe.foodCostPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${recipe.foodCostPct}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
