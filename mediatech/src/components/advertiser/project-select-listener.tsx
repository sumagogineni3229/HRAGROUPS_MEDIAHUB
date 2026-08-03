"use client";

import { useEffect } from "react";

export function ProjectSelectListener() {
  useEffect(() => {
    const select = document.querySelector('select[name="projectId"]') as HTMLSelectElement | null;
    const field = document.getElementById('new-project-field');
    if (!select || !field) return;

    const onChange = () => {
      const show = select.value === 'NEW';
      field.style.display = show ? 'block' : 'none';
      const input = field.querySelector('input');
      if (input) {
        if (show) {
          input.setAttribute('required', 'true');
          input.focus();
        } else {
          input.removeAttribute('required');
        }
      }
    };

    select.addEventListener('change', onChange);
    return () => select.removeEventListener('change', onChange);
  }, []);

  return null;
}
