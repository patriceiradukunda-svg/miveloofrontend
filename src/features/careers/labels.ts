import type { DocId, JobType, WorkMode } from '@/config/careers';

export type T = (key: string, fallback?: string) => string;

/** Every string the careers forms show. Built on the server with t() and passed down as props. */
export function carLabels(t: T) {
  const docs: Record<DocId, string> = {
    cv: t('car.doc.cv', 'Curriculum vitae (CV)'),
    coverLetter: t('car.doc.coverLetter', 'Cover letter'),
    idDocument: t('car.doc.idDocument', 'Copy of national ID or passport'),
    certificates: t('car.doc.certificates', 'Academic or professional certificates'),
    portfolio: t('car.doc.portfolio', 'Portfolio or work samples'),
    references: t('car.doc.references', 'Reference letters'),
    other: t('car.doc.other', 'Other supporting document'),
  };
  const docHints: Record<DocId, string> = {
    cv: t('car.dochint.cv', 'Your latest CV, as a PDF or Word file.'),
    coverLetter: t('car.dochint.coverLetter', 'A short letter about why you want this role.'),
    idDocument: t('car.dochint.idDocument', 'A clear copy of your national ID or passport.'),
    certificates: t('car.dochint.certificates', 'Copies of the certificates that support your application.'),
    portfolio: t('car.dochint.portfolio', 'A few samples of your work.'),
    references: t('car.dochint.references', 'Letters from people who can speak about your work.'),
    other: t('car.dochint.other', 'Anything else that supports your application.'),
  };
  return {
    wiz: {
      back: t('car.back', 'Back'),
      next: t('car.next', 'Continue'),
      step: t('car.step', 'Step'),
      of: t('car.of', 'of'),
      fix: t('car.fix', 'Please complete the highlighted fields.'),
    },
    e: {
      required: t('car.e.required', 'This field is required.'),
      email: t('car.e.email', 'Enter a valid email address.'),
      phone: t('car.e.phone', 'Enter a valid phone number.'),
      url: t('car.e.url', 'Enter a web link that starts with http:// or https://.'),
      min: t('car.e.min', 'Please write at least {n} characters.'),
      year: t('car.e.year', 'Enter a four-digit year.'),
      file: t('car.e.file', 'Please add this document to continue.'),
      consent: t('car.e.consent', 'Please tick the box to continue.'),
      tooBig: t('car.e.tooBig', 'Your files add up to more than 20 MB. Remove a file or use a smaller one.'),
    },
    f: {
      firstName: t('car.f.firstName', 'First name'),
      lastName: t('car.f.lastName', 'Last name'),
      email: t('car.f.email', 'Email'),
      phone: t('car.f.phone', 'Phone number'),
      city: t('car.f.city', 'City or town'),
      country: t('car.f.country', 'Country'),
      link: t('car.f.link', 'LinkedIn or portfolio link (optional)'),
      status: t('car.f.status', 'Which describes you best?'),
      years: t('car.f.years', 'Years of relevant experience'),
      summary: t('car.f.summary', 'Tell us about your experience'),
      summaryHint: t('car.f.summaryHint', 'What have you worked on, and what are you proud of?'),
      skills: t('car.f.skills', 'Key skills'),
      skillsHint: t('car.f.skillsHint', 'List the skills that matter most for this role.'),
      level: t('car.f.level', 'Highest level of education'),
      field: t('car.f.field', 'Field of study'),
      school: t('car.f.school', 'School or institution'),
      year: t('car.f.year', 'Year completed (or expected)'),
      start: t('car.f.start', 'When could you start?'),
      why: t('car.f.why', 'Why do you want this role?'),
      heard: t('car.f.heard', 'How did you hear about this role? (optional)'),
      choose: t('car.f.choose', 'Select…'),
    },
    s: {
      you: { t: t('car.s.you', 'About you'), h: t('car.s.youHint', 'We use this to contact you about your application.') },
      exp: { t: t('car.s.exp', 'Your experience'), h: t('car.s.expHint', 'Tell us what you have done so far.') },
      edu: { t: t('car.s.edu', 'Education'), h: t('car.s.eduHint', 'Tell us about your studies.') },
      role: { t: t('car.s.role', 'About this role'), h: t('car.s.roleHint', 'A few questions to help us get to know you.') },
      review: { t: t('car.s.review', 'Review and send'), h: t('car.s.reviewHint', 'Check your answers. You can change any step before sending.') },
    },
    o: {
      status: [
        { value: 'employed', label: t('car.o.status.employed', 'Working now') },
        { value: 'looking', label: t('car.o.status.looking', 'Looking for work') },
        { value: 'student', label: t('car.o.status.student', 'Studying') },
        { value: 'self', label: t('car.o.status.self', 'Self-employed or running my own work') },
      ],
      years: [
        { value: 'none', label: t('car.o.years.none', 'None yet') },
        { value: 'lt1', label: t('car.o.years.lt1', 'Less than 1 year') },
        { value: 'y1to3', label: t('car.o.years.y1to3', '1 to 3 years') },
        { value: 'y3to5', label: t('car.o.years.y3to5', '3 to 5 years') },
        { value: 'gt5', label: t('car.o.years.gt5', 'More than 5 years') },
      ],
      level: [
        { value: 'secondary', label: t('car.o.level.secondary', 'Secondary school') },
        { value: 'diploma', label: t('car.o.level.diploma', 'Certificate or diploma') },
        { value: 'bachelor', label: t('car.o.level.bachelor', 'Bachelor’s degree') },
        { value: 'master', label: t('car.o.level.master', 'Master’s degree') },
        { value: 'doctorate', label: t('car.o.level.doctorate', 'Doctorate') },
        { value: 'other', label: t('car.o.level.other', 'Other') },
      ],
      start: [
        { value: 'now', label: t('car.o.start.now', 'Immediately') },
        { value: 'month', label: t('car.o.start.month', 'Within a month') },
        { value: 'quarter', label: t('car.o.start.quarter', 'In 1 to 3 months') },
        { value: 'later', label: t('car.o.start.later', 'In more than 3 months') },
      ],
    },
    docs,
    docHints,
    up: {
      choose: t('car.up.choose', 'Choose a file'),
      replace: t('car.up.replace', 'Replace file'),
      remove: t('car.up.remove', 'Remove'),
      drag: t('car.up.drag', 'Drag a file here, or'),
      accepted: t('car.up.accepted', 'PDF, Word, JPG or PNG, up to 5 MB.'),
      errType: t('car.up.errType', 'This file type is not accepted. Use PDF, Word, JPG or PNG.'),
      errSize: t('car.up.errSize', 'This file is larger than 5 MB.'),
      required: t('car.up.required', 'Required'),
      optional: t('car.up.optional', 'Optional'),
      skip: t('car.up.skip', 'You can skip this step if you have nothing to add.'),
    },
    consent: t('car.consent', 'I confirm that my answers are true. I agree that Miveloo may use my application and documents to consider me for this role.'),
    privacyLink: t('car.privacy', 'Read the privacy policy'),
    notProvided: t('car.notProvided', 'Not provided'),
    documents: t('car.documents', 'Documents'),
    submit: t('car.submit', 'Submit application'),
    errSend: t('car.errSend', 'We could not send your application. Please check your connection and try again.'),
    errTooBig: t('car.errTooBig', 'Your files are too large to send together. Remove a file or use smaller files.'),
    errWait: t('car.errWait', 'Too many attempts. Please wait a few minutes and try again.'),
    errNoBackend: t('car.errNoBackend', 'This site is not connected to the application service yet, so nothing was sent. Please try again later.'),
    done: {
      t: t('car.done.t', 'Application sent'),
      b: t('car.done.b', 'Thank you for applying. We have received your application.'),
      back: t('car.done.back', 'Back to careers'),
    },
    idea: {
      s: {
        you: { t: t('car.idea.s.you', 'About you'), h: t('car.idea.s.youHint', 'So we know who to talk to.') },
        idea: { t: t('car.idea.s.idea', 'Your idea'), h: t('car.idea.s.ideaHint', 'Tell us what you have in mind.') },
        join: { t: t('car.idea.s.join', 'How you want to join'), h: t('car.idea.s.joinHint', 'Tell us the part you see for yourself.') },
        doc: { t: t('car.idea.s.doc', 'Supporting document'), h: t('car.idea.s.docHint', 'Optional. A short document that explains your idea.') },
        review: { t: t('car.idea.s.review', 'Review and send'), h: t('car.idea.s.reviewHint', 'Check your answers. You can change any step before sending.') },
      },
      f: {
        name: t('car.idea.f.name', 'Your full name'),
        org: t('car.idea.f.org', 'Organisation or group (optional)'),
        phone: t('car.idea.f.phone', 'Phone number (optional)'),
        title: t('car.idea.f.title', 'Name of your idea'),
        problem: t('car.idea.f.problem', 'What problem does it solve?'),
        problemHint: t('car.idea.f.problemHint', 'Describe the issue you want to fix in this ecosystem.'),
        who: t('car.idea.f.who', 'Who benefits?'),
        whoHint: t('car.idea.f.whoHint', 'For example schools, suppliers, farmers or cooperatives.'),
        solution: t('car.idea.f.solution', 'How would it work?'),
        solutionHint: t('car.idea.f.solutionHint', 'Explain your idea in your own words.'),
        stage: t('car.idea.f.stage', 'Where is your idea today?'),
        role: t('car.idea.f.role', 'How would you like to join?'),
        extra: t('car.idea.f.extra', 'Anything else we should know? (optional)'),
      },
      o: {
        stage: [
          { value: 'thought', title: t('car.idea.o.stage.thought', 'Just a thought') },
          { value: 'research', title: t('car.idea.o.stage.research', 'I am researching it') },
          { value: 'pilot', title: t('car.idea.o.stage.pilot', 'I have a prototype or pilot') },
          { value: 'running', title: t('car.idea.o.stage.running', 'It is already running') },
        ],
        role: [
          { value: 'lead', title: t('car.idea.o.role.lead', 'I want to lead it') },
          { value: 'build', title: t('car.idea.o.role.build', 'I want to build it with the Miveloo team') },
          { value: 'advise', title: t('car.idea.o.role.advise', 'I want to advise or partner') },
        ],
      },
      consent: t('car.idea.consent', 'I confirm that my answers are true. I agree that Miveloo may use this information to consider my idea.'),
      submit: t('car.idea.submit', 'Send my idea'),
      errSend: t('car.idea.errSend', 'We could not send your idea. Please check your connection and try again.'),
      done: {
        t: t('car.idea.done.t', 'Idea sent'),
        b: t('car.idea.done.b', 'Thank you for sharing your idea. We have received it.'),
      },
    },
  };
}
export type CarLabels = ReturnType<typeof carLabels>;

/** Labels for job metadata shown on cards and detail pages. */
export function jobMeta(t: T) {
  const type: Record<JobType, string> = {
    'full-time': t('car.type.fullTime', 'Full-time'),
    'part-time': t('car.type.partTime', 'Part-time'),
    contract: t('car.type.contract', 'Contract'),
    internship: t('car.type.internship', 'Internship'),
    volunteer: t('car.type.volunteer', 'Volunteer'),
  };
  const mode: Record<WorkMode, string> = {
    'on-site': t('car.mode.onSite', 'On-site'),
    hybrid: t('car.mode.hybrid', 'Hybrid'),
    remote: t('car.mode.remote', 'Remote'),
  };
  return { type, mode };
}
