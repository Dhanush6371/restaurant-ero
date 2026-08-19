'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { menuItems, modifiers } from '@/lib/mock-data';
import type { MenuItem, MenuCategory } from '@/types';
import {
  Plus, Search, Edit, Copy, Archive, Pencil, Tag, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

const categories: MenuCategory[] = ['Entrées', 'Plats', 'Desserts', 'Fromage', 'Wine', 'Drinks', 'Cocktails', 'Specials'];
const allergenList = ['Gluten', 'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Nuts', 'Sulphites', 'None'];

export default function MenuPage() {
  const [items, setItems] = useState(menuItems);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Plats' as MenuCategory,
    price: 0, foodCost: 0, prepTime: 10, allergens: [] as string[],
    tags: '', available: true, image: '',
  });

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (filterCat !== 'all' && m.category !== filterCat) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filterCat, search]);

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  };

  const duplicateItem = (item: MenuItem) => {
    const newId = `m${items.length + 1}`;
    setItems((prev) => [...prev, { ...item, id: newId, name: `${item.name} (Copy)` }]);
    toast.success(`${item.name} duplicated`);
  };

  const archiveItem = (item: MenuItem) => {
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    toast.success(`${item.name} archived`);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setFormData({
      name: item.name, description: item.description, category: item.category,
      price: item.price, foodCost: item.foodCost, prepTime: item.prepTime,
      allergens: item.allergens, tags: item.tags.join(', '), available: item.available, image: item.image,
    });
    setAddOpen(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setFormData({ name: '', description: '', category: 'Plats', price: 0, foodCost: 0, prepTime: 10, allergens: [], tags: '', available: true, image: '' });
    setAddOpen(true);
  };

  const saveItem = () => {
    if (editItem) {
      setItems((prev) => prev.map((m) => (m.id === editItem.id ? {
        ...m, name: formData.name, description: formData.description, category: formData.category,
        price: formData.price, foodCost: formData.foodCost, prepTime: formData.prepTime,
        allergens: formData.allergens, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        available: formData.available, image: formData.image || m.image,
      } : m)));
      toast.success(`${formData.name} updated`);
    } else {
      const newId = `m${items.length + 1}`;
      setItems((prev) => [...prev, {
        id: newId, name: formData.name, description: formData.description, category: formData.category,
        price: formData.price, foodCost: formData.foodCost, prepTime: formData.prepTime,
        allergens: formData.allergens, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        available: formData.available, hasModifiers: false, image: formData.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        station: 'Hot Kitchen',
      }]);
      toast.success(`${formData.name} added to menu`);
    }
    setAddOpen(false);
  };

  const toggleAllergen = (a: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(a) ? prev.allergens.filter(x => x !== a) : [...prev.allergens, a],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Menu Management"
        description="Manage dishes, categories, modifiers, and allergens"
        actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Dish</Button>}
      />

      <Tabs defaultValue="dishes">
        <TabsList>
          <TabsTrigger value="dishes">Dishes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
          <TabsTrigger value="allergens">Allergens</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        {/* Dishes tab */}
        <TabsContent value="dishes" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search dishes…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Image</TableHead>
                      <TableHead>Dish</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Food Cost</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Margin</TableHead>
                      <TableHead className="hidden lg:table-cell">Allergens</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => {
                      const margin = item.price - item.foodCost;
                      const marginPct = ((margin / item.price) * 100).toFixed(0);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                          <TableCell className="text-right font-semibold">€{item.price}</TableCell>
                          <TableCell className="text-right hidden md:table-cell text-muted-foreground">€{item.foodCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <span className="font-medium">€{margin.toFixed(2)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({marginPct}%)</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {item.allergens.slice(0, 3).map((a) => (
                                <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>
                              ))}
                              {item.allergens.length > 3 && <Badge variant="outline" className="text-[10px]">+{item.allergens.length - 3}</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(item)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => duplicateItem(item)}>
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => archiveItem(item)}>
                                <Archive className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories tab */}
        <TabsContent value="categories">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const count = items.filter((m) => m.category === cat).length;
              return (
                <Card key={cat} className="border-border/60">
                  <CardContent className="p-5">
                    <p className="font-serif text-lg font-semibold">{cat}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{count} dishes</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Modifiers tab */}
        <TabsContent value="modifiers">
          <div className="space-y-4">
            {modifiers.map((mod) => (
              <Card key={mod.id} className="border-border/60">
                <CardContent className="p-4">
                  <p className="font-semibold">{mod.name}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mod.options.map((opt) => (
                      <Badge key={opt.name} variant="outline">
                        {opt.name}{opt.price > 0 && <span className="ml-1 text-muted-foreground">+€{opt.price}</span>}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Allergens tab */}
        <TabsContent value="allergens">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allergenList.map((a) => {
              const count = items.filter((m) => m.allergens.includes(a)).length;
              return (
                <Card key={a} className="border-border/60">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{a}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{count} dishes contain {a}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Availability tab */}
        <TabsContent value="availability">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dish</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Toggle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.available ? <Badge className="bg-success/10 text-success border-success/20">Available</Badge> : <Badge variant="secondary">Unavailable</Badge>}
                      </TableCell>
                      <TableCell><Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dish Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Dish' : 'Add Dish'}</DialogTitle>
            <DialogDescription>{editItem ? 'Update dish information' : 'Create a new menu item'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label className="mb-1.5 block">Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Dish name" />
            </div>
            <div>
              <Label className="mb-1.5 block">Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as MenuCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Price (€)</Label>
                <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Food Cost (€)</Label>
                <Input type="number" step="0.01" value={formData.foodCost} onChange={(e) => setFormData({ ...formData, foodCost: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label className="mb-1.5 block">Prep Time (min)</Label>
                <Input type="number" value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {allergenList.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAllergen(a)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      formData.allergens.includes(a) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Tags (comma-separated)</Label>
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Signature, Popular" />
            </div>
            <div>
              <Label className="mb-1.5 block">Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://…" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.available} onCheckedChange={(v) => setFormData({ ...formData, available: v })} />
              <Label>Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={saveItem} disabled={!formData.name}>{editItem ? 'Save Changes' : 'Add Dish'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
