import { supabase } from '../lib/supabase';
import { seoCheckpoints } from './seoCheckpoints';

export async function seedSEOCheckpoints() {
  try {
    // Check if checkpoints already exist
    const { data: existing } = await supabase
      .from('seo_checkpoints')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('SEO checkpoints already seeded');
      return;
    }

    // Format checkpoints for insertion
    const checkpointsToInsert = seoCheckpoints.map(cp => ({
      id: cp.id,
      checkpoint_number: cp.number,
      category: cp.category,
      name: cp.name,
      description: cp.description,
      how_to_fix: cp.howToFix,
      expected_result: cp.expectedResult,
      source: cp.source,
      difficulty: cp.difficulty,
      estimated_time: cp.estimatedTime,
      priority: cp.priority,
      is_critical: cp.isCritical,
      metric: cp.metric,
      unit_type: cp.unit,
      optimal_value: cp.optimal
    }));

    // Insert in batches of 50
    for (let i = 0; i < checkpointsToInsert.length; i += 50) {
      const batch = checkpointsToInsert.slice(i, i + 50);
      const { error } = await supabase
        .from('seo_checkpoints')
        .insert(batch);

      if (error) {
        console.error('Error seeding batch:', error);
      } else {
        console.log(`Seeded ${Math.min(batch.length, i + 50)} checkpoints`);
      }
    }

    console.log('SEO checkpoints seeded successfully');
  } catch (error) {
    console.error('Error seeding checkpoints:', error);
  }
}
