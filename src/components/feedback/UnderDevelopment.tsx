import Link from "next/link";

type UnderDevelopmentProps = {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

export default function UnderDevelopment({
  title,
  description,
  backHref,
  backLabel = "Return to workspace",
}: UnderDevelopmentProps) {
  return (
    <section
      aria-labelledby="under-development-title"
      className="mx-auto flex w-full max-w-4xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-amber-500"
          />
          Under Development
        </span>

        <div
          aria-hidden="true"
          className="my-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-3xl"
        >
          ◷
        </div>

        <h1
          id="under-development-title"
          className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl"
        >
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          {description}
        </p>

        <p className="mt-3 text-sm leading-6 text-stone-500">
          We are preparing this part of Miveloo. It will become available when
          its design, functionality, and quality checks are complete.
        </p>

        {backHref ? (
          <div className="mt-8">
            <Link
              href={backHref}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              {backLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
