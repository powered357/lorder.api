import { EntityRepository, Repository } from 'typeorm';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {

  /** all selectors must be here */

}