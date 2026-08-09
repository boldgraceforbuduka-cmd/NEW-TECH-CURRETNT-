"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "general",
    tags: "",
  });

  useEffect(() => {
    if (!id) return;
    async function loadArticle() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          category: data.category || "general",
          tags: Array.isArray(data.tags)
            ? data.tags.join(", ")
            : data.tags || "",
        });
      }
      setLoading(false);
    }
    loadArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("articles")
      .update({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Article updated successfully!");
      router.push("/admin/articles");
    }
    setSaving(false);
  };

  if (loading) return <p className="p-8">Loading article details...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-6">
        Edit Article #{id}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Title</label>
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Content</label>
          <Textarea
            rows={8}
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <select
            className="w-full p-3 bg-muted border border-border rounded-md text-foreground"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="general">General</option>
            <option value="ai">AI</option>
            <option value="programming">Programming</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="startups">Startups</option>
            <option value="gadgets">Gadgets</option>
            <option value="science">Science</option>
            <option value="africa">Africa</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Tags (comma separated)
          </label>
          <Input
            placeholder="tech, innovation"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Article"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/articles")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
