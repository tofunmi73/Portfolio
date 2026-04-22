export function ArtistStatement() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-8 font-sans">Artist Statement</p>

        <blockquote className="font-serif text-2xl md:text-3xl font-light leading-relaxed text-foreground mb-8">
          "My art explores how people find things to hold onto in life — looking at how these guiding forces
          have changed over time and across different cultures, and what truly grounds us amidst
          life's constant flux."
        </blockquote>

        <div className="w-10 h-px bg-accent mb-8" />

        <p className="text-muted-foreground leading-relaxed max-w-xl">
          Through abstraction and abstracted portraiture, I open a dialogue about the diverse forms and
          historical shifts of these vital anchors — rooted in West African cultures connected to the Niger River,
          exploring how tradition helps us find what to hold onto today.
        </p>

        <p className="mt-6 text-sm text-muted-foreground/70 font-sans italic">— Jesutofunmi Ogidan</p>
      </div>
    </section>
  )
}
