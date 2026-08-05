"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type ProjectCategoryId,
  type ProjectStatus,
} from "@/config/categories";
import { slugify } from "@/lib/security";
import {
  createProject,
  updateProject,
  deleteProjectImage,
  deleteOrphanBlob,
  type GalleryImageInput,
} from "@/actions/projects";
import type { ProjectWithImages } from "@/types";

type GalleryItem = GalleryImageInput & {
  localKey: string;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: ProjectWithImages;
};

function toAsciiSlug(title: string) {
  const raw = slugify(title)
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return raw.slice(0, 220);
}

function emptyForm() {
  return {
    title: "",
    slug: "",
    category: "websites" as ProjectCategoryId,
    shortDescription: "",
    overview: "",
    challenge: "",
    solution: "",
    features: [] as string[],
    technologies: [] as string[],
    coverImageUrl: null as string | null,
    coverImagePathname: null as string | null,
    coverImageAlt: "",
    liveUrl: "",
    externalUrl: "",
    status: "draft" as ProjectStatus,
    featured: false,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
  };
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const initial = useMemo(() => {
    if (!project) return emptyForm();
    return {
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription,
      overview: project.overview,
      challenge: project.challenge,
      solution: project.solution,
      features: project.features ?? [],
      technologies: project.technologies ?? [],
      coverImageUrl: project.coverImageUrl,
      coverImagePathname: project.coverImagePathname,
      coverImageAlt: project.coverImageAlt ?? "",
      liveUrl: project.liveUrl ?? "",
      externalUrl: project.externalUrl ?? "",
      status: project.status,
      featured: project.featured,
      sortOrder: project.sortOrder,
      seoTitle: project.seoTitle ?? "",
      seoDescription: project.seoDescription ?? "",
    };
  }, [project]);

  const [form, setForm] = useState(initial);
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    (project?.images ?? []).map((img, index) => ({
      localKey: img.id,
      id: img.id,
      url: img.url,
      pathname: img.pathname,
      alt: img.alt,
      caption: img.caption,
      sortOrder: img.sortOrder ?? index,
      width: img.width,
      height: img.height,
    })),
  );

  const originalSlug = project?.slug;
  const wasPublished = project?.status === "published";
  const projectId = project?.id ?? "";

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setField("title", title);
    if (!slugTouched) {
      setField("slug", toAsciiSlug(title));
    }
  }

  function addTag(
    kind: "features" | "technologies",
    value: string,
    clear: () => void,
  ) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((prev) => {
      if (prev[kind].includes(trimmed)) return prev;
      return { ...prev, [kind]: [...prev[kind], trimmed] };
    });
    clear();
  }

  function removeTag(kind: "features" | "technologies", value: string) {
    setForm((prev) => ({
      ...prev,
      [kind]: prev[kind].filter((item) => item !== value),
    }));
  }

  function moveGallery(index: number, direction: -1 | 1) {
    setGallery((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      return next.map((item, i) => ({ ...item, sortOrder: i }));
    });
  }

  function handleCoverChange(value: UploadedImage | null) {
    setForm((prev) => ({
      ...prev,
      coverImageUrl: value?.url ?? null,
      coverImagePathname: value?.pathname ?? null,
    }));
  }

  async function handleCoverDelete() {
    // Blob is removed on save when cover pathname changes (see updateProject).
  }

  function handleGalleryUpload(value: UploadedImage | null) {
    if (!value) return;
    setGallery((prev) => [
      ...prev,
      {
        localKey: `new-${crypto.randomUUID()}`,
        url: value.url,
        pathname: value.pathname,
        alt: "",
        caption: null,
        sortOrder: prev.length,
      },
    ]);
  }

  async function handleGalleryDelete(item: GalleryItem) {
    if (item.id) {
      const result = await deleteProjectImage(item.id);
      if (!result.ok) {
        throw new Error(result.error);
      }
      if (result.data?.warning) {
        toast.warning(result.data.warning);
      }
    } else if (item.pathname) {
      const result = await deleteOrphanBlob(item.pathname);
      if (!result.ok) {
        throw new Error(result.error);
      }
      if (result.data?.warning) {
        toast.warning(result.data.warning);
      }
    }
    setGallery((prev) =>
      prev
        .filter((g) => g.localKey !== item.localKey)
        .map((g, i) => ({ ...g, sortOrder: i })),
    );
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldErrors({});

    const payload = {
      title: form.title,
      slug: form.slug,
      category: form.category,
      shortDescription: form.shortDescription,
      overview: form.overview,
      challenge: form.challenge,
      solution: form.solution,
      features: form.features,
      technologies: form.technologies,
      coverImageUrl: form.coverImageUrl,
      coverImagePathname: form.coverImagePathname,
      coverImageAlt: form.coverImageAlt || null,
      liveUrl: form.liveUrl || null,
      externalUrl: form.externalUrl || null,
      status: form.status,
      featured: form.featured,
      sortOrder: form.sortOrder,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
    };

    const galleryPayload: GalleryImageInput[] = gallery.map((item, index) => ({
      id: item.id,
      url: item.url,
      pathname: item.pathname,
      alt: item.alt,
      caption: item.caption,
      sortOrder: index,
      width: item.width,
      height: item.height,
    }));

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProject(payload, galleryPayload)
          : await updateProject(projectId, payload, galleryPayload);

      if (!result.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      const data = result.data as { id: string; warnings?: string[] };
      if (data.warnings?.length) {
        toast.warning(data.warnings.join(" · "));
      }

      toast.success(mode === "create" ? "პროექტი შეიქმნა" : "პროექტი განახლდა");
      router.push(`/admin/projects/${data.id}/edit`);
      router.refresh();
    });
  }

  const showSlugWarning =
    wasPublished && originalSlug && form.slug !== originalSlug;

  function err(key: string) {
    return fieldErrors[key]?.[0];
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">ძირითადი</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">სათაური</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            {err("title") ? (
              <p className="text-xs text-destructive">{err("title")}</p>
            ) : null}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value);
              }}
              required
            />
            {showSlugWarning ? (
              <p className="text-xs text-amber-700">
                გამოქვეყნებული პროექტის slug-ის შეცვლა შეცვლის საჯარო URL-ს.
                ძველი ბმულები აღარ იმუშავებს.
              </p>
            ) : null}
            {err("slug") ? (
              <p className="text-xs text-destructive">{err("slug")}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label>კატეგორია</Label>
            <Select
              value={form.category}
              onValueChange={(value) => {
                if (value) setField("category", value as ProjectCategoryId);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>სტატუსი</Label>
            <Select
              value={form.status}
              onValueChange={(value) => {
                if (value) setField("status", value as ProjectStatus);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "draft" ? "დრაფტი" : "გამოქვეყნებული"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="shortDescription">მოკლე აღწერა</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => setField("shortDescription", e.target.value)}
              rows={3}
              required
            />
            {err("shortDescription") ? (
              <p className="text-xs text-destructive">
                {err("shortDescription")}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">ტექსტები</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="overview">მიმოხილვა</Label>
            <Textarea
              id="overview"
              value={form.overview}
              onChange={(e) => setField("overview", e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="challenge">გამოწვევა</Label>
            <Textarea
              id="challenge"
              value={form.challenge}
              onChange={(e) => setField("challenge", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="solution">გადაწყვეტა</Label>
            <Textarea
              id="solution"
              value={form.solution}
              onChange={(e) => setField("solution", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">ფუნქციები და ტექნოლოგიები</h2>

        <TagEditor
          label="ფუნქციები"
          items={form.features}
          input={featureInput}
          onInputChange={setFeatureInput}
          onAdd={() =>
            addTag("features", featureInput, () => setFeatureInput(""))
          }
          onRemove={(value) => removeTag("features", value)}
        />

        <TagEditor
          label="ტექნოლოგიები"
          items={form.technologies}
          input={techInput}
          onInputChange={setTechInput}
          onAdd={() =>
            addTag("technologies", techInput, () => setTechInput(""))
          }
          onRemove={(value) => removeTag("technologies", value)}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">მედია</h2>

        {mode === "create" || !projectId ? (
          <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            ქავერისა და გალერეის ატვირთვა ხელმისაწვდომი იქნება პროექტის
            შენახვის შემდეგ.
          </div>
        ) : (
          <>
            <ImageUploader
              projectId={projectId}
              label="ქავერი"
              value={
                form.coverImageUrl && form.coverImagePathname
                  ? {
                      url: form.coverImageUrl,
                      pathname: form.coverImagePathname,
                    }
                  : null
              }
              onChange={handleCoverChange}
              onDelete={handleCoverDelete}
            />
            <div className="space-y-1.5">
              <Label htmlFor="coverImageAlt">ქავერის alt ტექსტი</Label>
              <Input
                id="coverImageAlt"
                value={form.coverImageAlt}
                onChange={(e) => setField("coverImageAlt", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium">გალერეა</h3>
              </div>

              <ImageUploader
                projectId={projectId}
                label="გალერეაში დამატება"
                value={null}
                onChange={handleGalleryUpload}
              />

              <ul className="space-y-3">
                {gallery.map((item, index) => (
                  <li
                    key={item.localKey}
                    className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[120px_1fr_auto]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt || ""}
                      className="aspect-video w-full rounded-md object-cover sm:aspect-square"
                    />
                    <div className="space-y-2">
                      <Input
                        placeholder="Alt ტექსტი"
                        value={item.alt}
                        onChange={(e) =>
                          setGallery((prev) =>
                            prev.map((g) =>
                              g.localKey === item.localKey
                                ? { ...g, alt: e.target.value }
                                : g,
                            ),
                          )
                        }
                      />
                      <Input
                        placeholder="წარწერა (ოფციონალური)"
                        value={item.caption ?? ""}
                        onChange={(e) =>
                          setGallery((prev) =>
                            prev.map((g) =>
                              g.localKey === item.localKey
                                ? {
                                    ...g,
                                    caption: e.target.value || null,
                                  }
                                : g,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-1 sm:flex-col">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={index === 0}
                        onClick={() => moveGallery(index, -1)}
                        aria-label="ზემოთ"
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={index === gallery.length - 1}
                        onClick={() => moveGallery(index, 1)}
                        aria-label="ქვემოთ"
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          void handleGalleryDelete(item).catch((error) => {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "წაშლა ვერ მოხერხდა",
                            );
                          });
                        }}
                        aria-label="წაშლა"
                      >
                        <X />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">ბმულები და პარამეტრები</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              type="url"
              value={form.liveUrl}
              onChange={(e) => setField("liveUrl", e.target.value)}
              placeholder="https://"
            />
            {err("liveUrl") ? (
              <p className="text-xs text-destructive">{err("liveUrl")}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="externalUrl">გარე URL</Label>
            <Input
              id="externalUrl"
              type="url"
              value={form.externalUrl}
              onChange={(e) => setField("externalUrl", e.target.value)}
              placeholder="https://"
            />
            {err("externalUrl") ? (
              <p className="text-xs text-destructive">{err("externalUrl")}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">დალაგება</Label>
            <Input
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setField("sortOrder", Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
            <div>
              <div className="text-sm font-medium">რჩეული</div>
              <div className="text-xs text-muted-foreground">
                გამოჩნდება მთავარ გვერდზე
              </div>
            </div>
            <Switch
              checked={form.featured}
              onCheckedChange={(checked) => setField("featured", checked)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold">SEO</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">SEO სათაური</Label>
            <Input
              id="seoTitle"
              value={form.seoTitle}
              onChange={(e) => setField("seoTitle", e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDescription">SEO აღწერა</Label>
            <Textarea
              id="seoDescription"
              value={form.seoDescription}
              onChange={(e) => setField("seoDescription", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "ინახება…" : mode === "create" ? "შექმნა" : "შენახვა"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => router.push("/admin/projects")}
        >
          უკან
        </Button>
      </div>
    </form>
  );
}

function TagEditor({
  label,
  items,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  input: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="დაამატეთ და დააჭირეთ Enter"
        />
        <Button type="button" variant="outline" size="icon" onClick={onAdd}>
          <Plus />
        </Button>
      </div>
      {items.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
            >
              {item}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onRemove(item)}
                aria-label={`წაშლა ${item}`}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
